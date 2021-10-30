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


const banwords = [
  'アホ',
  'カス',
  'バカ',
  'ばか',
  '馬鹿',
  'ボケ',
  '死ね',
  'しね',
  'ふざけんな',
  '殺す',
  'ころす',
  'コロス',
  '絶交',
  '許さない'
];

const apologiesList = [
  [
      'ていうのはうそ',
      '本心は違うよ❤'
  ],
  [
      'なんてことは言いません',
      'こんなひどいこと言えないよ'
  ],
  [
      '////'
  ],
  [
      '......',
      'ごめん、言い過ぎた。',
      '許して、もらえますか...?'
  ],
  [
      'こんなふうに言わたら興奮するのにな〜?',
      '...',
      'まだかなぁ〜〜〜???'
  ]
];


module.exports = async (req, res) => {
  const body = req.body;
  const pushMessage = {
    userId: body.userId,
    username: body.username,
    message: body.message,
  };

  pusher.trigger(env.PUSHER_CHAT_CHANNEL, env.PUSHER_MESSAGE_EVENT, pushMessage)
    .then(resp => res.status(200).send(resp))
    .catch(err => res.status(400).send(err));

  banwords.forEach(banword => {
    if (body.message.includes(banword)) {
      const randApologies = apologiesList[Math.floor(Math.random() * apologiesList.length)];

      randApologies.forEach(apology => {
        const pushApology = {
          userId: body.userId,
          username: body.username,
          message: apology,
        };

        await new Promise(r => setTimeout(r, 1000));
        pusher.trigger(env.PUSHER_CHAT_CHANNEL, env.PUSHER_MESSAGE_EVENT, pushApology)
          .then(resp => res.status(200).send(resp))
          .catch(err => res.status(400).send(err))
        
      });

      return;
    }
  });
};
