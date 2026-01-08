const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.githubLogin = (req, res) => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GITHUB_CALLBACK_URL)}&scope=repo,user:email`;
  res.redirect(authUrl);
};

exports.githubCallback = async (req, res) => {
  const { code } = req.query;
  console.log('=== GitHub Callback ===');
  console.log('Received code:', code);

  if (!code) {
    console.error('No code provided');
    return res.redirect(`${process.env.CLIENT_URL}?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenResp = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      { headers: { Accept: 'application/json' } }
    );

    if (tokenResp.data.error) {
      console.error('GitHub token error:', tokenResp.data.error_description);
      return res.redirect(`${process.env.CLIENT_URL}?error=${encodeURIComponent(tokenResp.data.error_description)}`);
    }

    const accessToken = tokenResp.data.access_token;
    console.log('✅ Got GitHub access token');

    // Get user info from GitHub
    const userResp = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    console.log('✅ Got GitHub user:', userResp.data.login);

    // Create JWT token with GitHub info
    const token = jwt.sign(
      { 
        githubId: userResp.data.id, 
        githubToken: accessToken, 
        login: userResp.data.login 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Created JWT token, redirecting to frontend');

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  } catch (error) {
    console.error('GitHub callback error:', error.response?.data || error.message);
    res.redirect(`${process.env.CLIENT_URL}?error=${encodeURIComponent(error.message)}`);
  }
};


exports.getUserInfo = async (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    let githubToken;

    if (authHeader) {
      // Extract JWT and get GitHub token from it
      const jwtToken = authHeader.replace('Bearer ', '');
      
      try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        githubToken = decoded.githubToken;
        console.log('✅ Using user GitHub token from JWT');
      } catch (err) {
        console.log('⚠️ Invalid JWT, falling back to server token');
        githubToken = process.env.GITHUB_TOKEN;
      }
    } else {
      // Fallback to server token for unauthenticated requests
      githubToken = process.env.GITHUB_TOKEN;
      console.log('⚠️ No auth header, using server token');
    }

    const response = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${githubToken}`
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('GitHub getUserInfo error:', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
};