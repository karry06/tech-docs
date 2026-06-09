# Docker 常用笔记

Docker 使用容器封装应用及其依赖，让开发、测试和部署环境保持一致。

## 常用命令

```bash
# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 查看镜像
docker images

# 查看容器日志
docker logs -f <container>
```

## Docker Compose

```bash
# 启动服务
docker compose up -d

# 查看服务状态
docker compose ps

# 停止并清理服务
docker compose down
```

## 清理未使用资源

> 执行清理前，请确认未使用资源中没有仍需保留的数据。

```bash
docker system df
docker system prune
```
