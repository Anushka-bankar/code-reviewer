let Octokit; // will be loaded dynamically

class GitHubPRService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.octokit = null;
  }

  async init() {
    if (!Octokit) {
      const mod = await import("@octokit/rest");
      Octokit = mod.Octokit;
    }

    if (!this.octokit) {
      this.octokit = new Octokit({ auth: this.accessToken });
    }
  }

  // List user's repositories
  async listRepositories() {
    try {
      await this.init();
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        per_page: 100,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to list repos: ${error.message}`);
    }
  }

  // Get file content from repo
  async getFileContent(owner, repo, path) {
    try {
      await this.init();
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      return {
        content: Buffer.from(data.content, "base64").toString("utf-8"),
        sha: data.sha,
      };
    } catch (error) {
      throw new Error(`Failed to get file: ${error.message}`);
    }
  }

  // Create branch
  async createBranch(owner, repo, branchName, sha) {
    try {
      await this.init();
      await this.octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha,
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to create branch: ${error.message}`);
    }
  }

  // Update file on branch
  async updateFile(owner, repo, path, content, branchName, sha, message) {
    try {
      await this.init();
      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString("base64"),
        branch: branchName,
        sha,
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to update file: ${error.message}`);
    }
  }

  // Create Pull Request
  async createPullRequest(owner, repo, title, body, head, base = "main") {
    try {
      await this.init();
      const { data } = await this.octokit.pulls.create({
        owner,
        repo,
        title,
        body,
        head,
        base,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to create PR: ${error.message}`);
    }
  }

  // Get default branch
  async getDefaultBranch(owner, repo) {
    try {
      await this.init();
      const { data } = await this.octokit.repos.get({ owner, repo });
      return data.default_branch;
    } catch (error) {
      throw new Error(`Failed to get default branch: ${error.message}`);
    }
  }

  // Get latest commit SHA
  async getLatestCommitSha(owner, repo, branch = "main") {
    try {
      await this.init();
      const { data } = await this.octokit.repos.getBranch({
        owner,
        repo,
        branch,
      });
      return data.commit.sha;
    } catch (error) {
      throw new Error(`Failed to get commit SHA: ${error.message}`);
    }
  }
}

module.exports = GitHubPRService;
