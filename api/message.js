const fs = require('fs');
const Pusher = require('pusher');

require('dotenv').config();
const env = process.env;

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.PUSHER_CLUSTER,
  useTLS: true,
});


fs.readFile('banwords.json', 'utf-8', (err, data) => {
  if (err) throw err;
  const banwords = JSON.parse(data);
})
fs.readFile('apologiesList.json', 'utf-8', (err, data) => {
  if (err) throw err;
  const apologiesList = JSON.parse(data);
})


module.exports = (req, res) => {
  const body = req.body;
  const pushMessage = {
    userId: body.userId,
    username: body.username,
    message: body.message,
  };

  pusher.trigger(env.PUSHER_CHAT_CHANNEL, env.PUSHER_MESSAGE_EVENT, pushMessage)
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(400).send(err));

  if (body.message in banwords) {
    apologiesList.forEach(apologies => {
      apologies.forEach(apology => {
        const pushApology = {
          userId: body.userId,
          username: body.username,
          message: apology,
        };

        pusher.trigger(env.PUSHER_CHAT_CHANNEL, env.PUSHER_MESSAGE_EVENT, pushApology)
          .then(resp => res.status(200).send(resp))
          .catch(err => res.status(400).send(err));
      });
    });
  }
};
