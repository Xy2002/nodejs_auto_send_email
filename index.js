const nodemailer = require("nodemailer");
const axios = require('axios')
const cron = require('node-cron')
const messagePush = require('./serverChanPush')
require('dotenv').config()
async function main() {
    let weatherConfig = {
        method: 'get',
        url: `https://devapi.qweather.com/v7/weather/3d?location=${process.env.location}&key=${process.env.weatherKey}`,
    };

    let weatherRes = await axios(weatherConfig)
    let todayWeather = weatherRes['data']['daily'][0]

    let indicesConfig = {
        method: 'get',
        url: `https://devapi.qweather.com/v7/indices/1d?location=${process.env.location}&key=${process.env.weatherKey}&type=3,5,8,9,10,11,13,14,16`,
    };
    let indicesRes = await axios(indicesConfig)
    let todayIndices = indicesRes['data']['daily']

    let config = {
        method: 'get',
        url: 'https://api.vvhan.com/api/love?type=json',
        headers: {}
    };

    let res = await axios(config)

    let html = `
<link href="https://cdn.jsdelivr.net/npm/qweather-icons@1.1.1/font/qweather-icons.css" rel="stylesheet">
<style>
    p {
        font-size: 14px;
        font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
        text-indent: 2rem;
        line-height: 1rem;
    }
    span {
        color: green;
        line-height: 1rem;
    }
</style>

<div style="width: 90vw; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);border: 1px solid #eee;position: relative;text-align: center">
    <p style="font-size: 18px;font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','微软雅黑',Arial,sans-serif;color: gray;font-weight: bolder">
        今天向宝子的爱心报道</p>
    <div style="text-align: left;margin:2em 2em">
        <p>
            今天也是爱宝的一天噢😘
        </p>
        <p>
            今天想对你说的土味情话: <span style="color: deeppink">${res['data']['ishan']}</span>
        </p>
        <p>
            今天的最高温度为<span>${todayWeather['tempMax']}</span>度;最低温度为<span>${todayWeather['tempMin']}</span>度;
        </p>
        <p>
            湿度为<span>${todayWeather['humidity']}%</span>;能见度为<span>${todayWeather['vis']}</span>公里
        </p>
        <p>
            白天的天气状况为<i style="text-indent:0" class="qi-${todayWeather['iconDay']}"></i><span>${todayWeather['textDay']}</span>;风向为<span>${todayWeather['windDirDay']}</span>,风力等级为<span>${todayWeather['windScaleDay']}</span>;
        </p>
        <p>
            夜间的天气状况为<i style="text-indent:0" class="qi-${todayWeather['iconNight']}"></i><span>${todayWeather['textNight']}</span>;风向为<span>${todayWeather['windDirNight']}</span>,风力等级为<span>${todayWeather['windScaleNight']}</span>;
        </p>
        <p>
           ${todayIndices[0]['text']}
        </p>
        <p>
           ${todayIndices[1]['text']}
        </p>
        <p>
           ${todayIndices[2]['text']}
        </p>
        <p>
           ${todayIndices[3]['text']}
        </p>
        <p>
           ${todayIndices[4]['text']}
        </p>
        <p>
           ${todayIndices[5]['text']}
        </p>
        <p>
           ${todayIndices[6]['text']}
        </p>
        <p>
            ${todayIndices[7]['text']}
        </p>
        <p>
            ${todayIndices[8]['text']}
        </p>
    </div>
</div>
`
    let transporter = nodemailer.createTransport({
        host: process.env.emailHost,
        secure: true, // true for 465, false for other ports
        //port: 465
        auth: {
            user: process.env.fromEmail,
            pass: process.env.fromPass,
        },
    });

    let info = await transporter.sendMail({
        from: `"Your Darling 🥰" ${process.env.fromEmail}`, // 发送方邮箱的账号
        to: process.env.toEmail, // 邮箱接受者的账号
        subject: "今天也是爱你的一天", // Subject line
        html, // html 内容, 如果设置了html内容, 将忽略text内容
    });
    if (process.env.debug === 'true') {
        console.log(info)
    } else {
        messagePush('邮件推送成功', `接受人:${info['accepted'].join(',')};发送人:${info['envelope']['from']};响应:${info['response']}`)
    }
}

if (process.env.debug === 'true') {
    main().catch(err => console.error(err))
} else {
    cron.schedule(process.env.scheduleTime, async () => {
        main().catch(err => {
            messagePush('邮件推送失败', err.message)
        })
    }, {
        timezone: 'Asia/Shanghai'
    });
}

process.on("uncaughtException", err => {
    messagePush('未知故障', err.message)
})
