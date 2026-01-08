const GitHubPRService = require('../services/githubPRService');
const Review = require('../models/Review');

exports.getRepositories = async (req, res, next) => {
  try {
    const githubToken = req.user?.githubToken;
    
    if (!githubToken) {
      return res.status(401).json({ error: 'GitHub token not found' });
    }

    const service = new GitHubPRService(githubToken);
    const repos = await service.listRepositories();
    
    res.json({ success: true, data: repos });
  } catch (error) {
    next(error);
  }
};

exports.createPullRequest = async (req, res, next) => {
  try {
    const { reviewId, owner, repo, filePath, baseBranch = 'main' } = req.body;
    const githubToken = req.user?.githubToken;

    if (!githubToken) {
      return res.status(401).json({ error: 'GitHub token not found' });
    }

    // Get the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const service = new GitHubPRService(githubToken);

    // Get default branch if not specified
    const defaultBranch = await service.getDefaultBranch(owner, repo);
    const base = baseBranch || defaultBranch;

    // Get latest commit SHA
    let baseSha = await service.getLatestCommitSha(owner, repo, base);

    // Get current file
    let fileData = await service.getFileContent(owner, repo, filePath);
    
    // Create branch name
    const branchName = `ai-review-${Date.now()}`;

    // Create new branch
    await service.createBranch(owner, repo, branchName, baseSha);

    // Update file with improved code
    try {
      await service.updateFile(
        owner,
        repo,
        filePath,
        review.improvedCode,
        branchName,
        fileData.sha,
        `AI Code Review: ${review.category}`
      );
    } catch (error) {
      // Handle SHA conflict (409)
      if (error.message.includes('409') || error.message.includes('conflict')) {
        // Re-fetch file and get new SHA
        fileData = await service.getFileContent(owner, repo, filePath);
        
        // Try again with updated SHA
        await service.updateFile(
          owner,
          repo,
          filePath,
          review.improvedCode,
          branchName,
          fileData.sha,
          `AI Code Review: ${review.category}`
        );
      } else {
        throw error;
      }
    }

    // Create Pull Request
    const prTitle = `[AI Review] ${review.category} - ${review.language}`;
    const prBody = `## AI Code Review

**Category:** ${review.category}

**Complexity Score:** ${review.metrics.complexityScore}/10
**Quality Rating:** ${review.metrics.qualityRating}

**Explanation:**
${review.explanation}

---
*This PR was automatically created by CodeReview.ai*`;

    const pr = await service.createPullRequest(
      owner,
      repo,
      prTitle,
      prBody,
      branchName,
      base
    );

    res.json({
      success: true,
      data: {
        prUrl: pr.html_url,
        prNumber: pr.number,
        branch: branchName,
      },
    });
  } catch (error) {
    next(error);
  }
};