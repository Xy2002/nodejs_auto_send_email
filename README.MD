# Auto Send Email To GirlFriend 
每天给女友送上一点小惊喜, 生活甜蜜蜜  

# 如何使用 (How to use)  
## 1.安装依赖  
本项目使用了`yarn`, clone本项目后，请执行命令`yarn`进行依赖安装
## 2.创建环境配置文件
在目录下创建 `production.env` 和 `development.env` 文件, 分别作用于正式实用阶段与调试阶段.文件内容应该如下  
```dotenv
#你的邮箱地址
fromEmail=xxx@domain.com
#你的邮箱的授权密码
#Tips:本项目默认邮箱的主机端口为465,若需修改,请在index.js的99行将secure改为false并在新增port进行自定义端口配置
fromPass=xxx
#ta的邮箱地址, 若有多个(强烈谴责)使用 , 分割
toEmail=xxx@domain.com
#若是development.env请填写true,若是production.env请填写false
debug=false
#serverChan的密钥
key=xxx
#和风天气的密钥
weatherKey=xxx
#ta的地理位置（经纬度）
location=xxx
#cron的执行时间 以下示例为每天早上八点
scheduleTime="0 8 * * *"
```  

## 3.获取本项目运作所需的key  
本项目使用了 [和风天气](https://dev.qweather.com/) 提供的api进行获取天气等信息, 使用 [server酱](https://sct.ftqq.com/) 实现推送反馈功能.  
只需在 [和风天气](https://dev.qweather.com/) 控制台进行注册并登陆, 然后在 控制台-应用管理-创建应用(免费开发版) 然后将key填写到env里的`weatherKey`值就可以了.  
并在 [server酱](https://sct.ftqq.com/) 按照教程进行推送配置, 然后将密钥填写至env里的`key`值就可以了.  

## 4.开始使用  
如果是需要调试, 则运行  `yarn test` , 若是进行实际使用, 请运行 `yarn start`.  
### 两者区别?
当环境变量env中的 `debug` 为 `true`时, 邮件将会直接发出, 若`debug` 为 `false`时,  邮件将会按照 `scheduleTime` 配置的时间发送


## 5.其他  
邮件模板在30行开始, 若有需要可进行修改, 获取到的模板内容请看第7,15,22行所配置的api接口进行调试, 并根据相关文档进行修改
