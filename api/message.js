const Pusher = require('pusher');

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: PUSHER_CLUSTER,
  useTLS: true
});

module.exports = (req, res) => {
  const body = JSON.parse(req.body);
  const pusherResp = {
    username: body.username,
    message: body.message
  };

  pusher.trigger(PUSHER_CHAT_CHANNEL, PUSHER_MESSAGE_EVENT, pusherResp)
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(400).send(err));
};
