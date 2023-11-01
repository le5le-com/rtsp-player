# RTSP Player

RTSP Web 播放器。需要乐吾乐 le5le 安装包中 app(.exe)作为服务。

# 本地开发

1. 下载乐吾乐 le5le 安装包：https://gitee.com/le5le/downloads，运行安装包中 app(.exe)

2. 修改 vite.config.ts 中的代理配置为上面服务地址。本地运行安装包中 app(.exe)省略，推荐。

```
pnpm i
pnpm start
```

# 编译

```
pnpm build
```

# 运行

1. 下载乐吾乐 le5le 安装包：https://gitee.com/le5le/downloads，运行安装包中 app(.exe)

2. 拷贝编译的 rtsp 文件夹到安装包中 webs 下

3. 访问 app(.exe) 服务的 ip:port/rtsp

# Copyright

@乐吾乐 le5le 保留所有权利
