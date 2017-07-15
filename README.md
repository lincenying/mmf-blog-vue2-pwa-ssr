# mmf-blog vuejs 2.0 服务端渲染 v2版

demo: [http://www.mmxiaowu.com](http://www.mmxiaowu.com)

## 说明

本站服务端采用 express + mongoDB 搭建, 客户端采用 Vue2 的服务端渲染搭建

主要功能包括: 管理员, 用户, 分类, 文章, 评论, 文章点赞

主要技术栈: express, mongoose, vue2, vue2-router, vuex, webpack, babel, eslint


```

---

#### 其他版本

react spa版本: [https://github.com/lincenying/mmf-blog-react-v2](https://github.com/lincenying/mmf-blog-react-v2)

vue2 spa版本: [https://github.com/lincenying/mmf-blog-vue2](https://github.com/lincenying/mmf-blog-vue2)

vue2 ssr版本: [https://github.com/lincenying/mmf-blog-vue2-ssr](https://github.com/lincenying/mmf-blog-vue2-ssr)

vue2 pwa ssr版本: [https://github.com/lincenying/mmf-blog-vue2-pwa-ssr](https://github.com/lincenying/mmf-blog-vue2-pwa-ssr)

---

```
配置文件: src/api/config-client.js (浏览器端)
api: api地址 (如果 api 服务器和网站服务器是同一个域名, 或者用了反向代理, 可以直接用省去域名的绝对路径, 如: /api/)
配置文件: src/api/config-server.js (服务器端)
api: api地址 (如果 api 服务器 和网站服务器在同一台主机, 可以用本地地址, 如: http://localhost:8080)
port: 启动端口
```

## 准备工作:
安装 NodeJS:
https://nodejs.org/zh-cn/

安装 Mongodb:
https://www.mongodb.com/download-center#community

```shell
# 安装依赖
$ npm install

# 或者
$ yarn
# 注意: 不要用 cnpm 安装依赖

# 开发模式
$ npm run dev

# 生产模式
$ npm run build

# 启动(需先运行 npm run build )
$ npm run start
```

首页
http://localhost:8080

登录
http://localhost:8080/backend

添加管理员
http://localhost:8080/api/backend

管理员添加成功后, 会自动生成 admin.lock 文件锁定, 如果需要继续添加, 请把该文件删除

# LICENSE

MIT
