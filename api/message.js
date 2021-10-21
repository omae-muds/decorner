const Pusher = require('pusher');

require('dotenv').config();
const env = process.env;

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.PUSHER_CLUSTER,
  useTLS: true
});

module.exports = (req, res) => {
  const body = req.body;
  const pusherResp = {
    username: body.username,
    message: body.message
  };

  pusher.trigger(env.PUSHER_CHAT_CHANNEL, env.PUSHER_MESSAGE_EVENT, pusherResp)
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(400).send(err));
};
