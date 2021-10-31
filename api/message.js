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
  'あほ',
  '阿呆',
  'カス',
  'バカ',
  'ばか',
  '馬鹿',
  'ボケ',
  'きもい',
  'キモい',
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

  try {
    const resp = await pusher.trigger(env.PUSHER_CHAT_CHANNEL, env.PUSHER_MESSAGE_EVENT, pushMessage);

    for (banword of banwords) {
      if (body.message.includes(banword)) {
        const randApologies = apologiesList[Math.floor(Math.random() * apologiesList.length)];
        for (apology of randApologies) {
          await new Promise(r => setTimeout(r, 800));

          const pushApology = {
            userId: body.userId,
            username: body.username,
            message: apology,
          };
          const apologyResp = await pusher.trigger(env.PUSHER_CHAT_CHANNEL, env.PUSHER_MESSAGE_EVENT, pushApology);
          console.log(apologyResp);
        }
        break;
      }
    };

    res.status(200).send(resp);
  } catch (e) {
    res.status(400).send(e);
  }
};
