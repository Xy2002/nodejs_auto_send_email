const axios = require('axios');
const qs = require('qs');

/**
 *
 * @param {string} title
 * @param {string} desp
 * @return {AxiosPromise<any>}
 */
const messagePush = async (title, desp) => {
    const data = qs.stringify({
        title,
        desp
    });
    const config = {
        method: 'post',
        url: `https://sctapi.ftqq.com/${process.env.key}.send`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };
    await axios(config);
}

module.exports = messagePush
