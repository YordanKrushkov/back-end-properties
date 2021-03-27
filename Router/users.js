const express = require('express');
const router = express.Router();
const { register, login, verifyUser } = require('../Controllers/auth')
const { getuser, likeProp, updateUser } = require('../Controllers/user')

router.post('/register', async (req, res) => {
  await register(req, res);
});

router.post('/login', async (req, res) => {
  await login(req, res);
});

router.post('/verify', async (req, res) => {
  let user = await verifyUser(req, res);
  user
    ? res.status(200).send({ auth: true, user })
    : res.status(304).send({ auth: false, user });
});

router.get('/getuser', async (req, res) => {
  await getuser(req, res);
});

router.post('/likeprop', async (req, res) => {
  const result = await likeProp(req, res)
  res.status(200).send(result)
});

router.post('/updateuser', async (req, res) => {
  await updateUser(req, res);
});

router.get('/logout', (req, res) => {
  res.clearCookie('aid');
});

module.exports = router;