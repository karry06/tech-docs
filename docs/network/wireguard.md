# WireGuard  配置

本文档的目的是实现内网穿透

大概网路拓扑如下：

```Bash
本人电脑-客户端
      ↓
拥有公网ip的云服务器
这里拿百度云 VPS（FRPS）举例
假设120.48.128.6
      ↓
FRP
      ↓
实验室跑着wg-easy进程的服务器（FRPC）
假设192.168.28.234
      ↓
wg-easy
      ↓
实验室局域网
192.168.28.0/23
```

客户端下载软件：`https://github.com/WireGuard`，根据系统自行选择

---

## 一、实验室服务器部署 wg\-easy

wg\-easy把WireGuard部署在docker里面，拆箱即用，推荐使用

服务器：

```Plain Text
192.168.28.234
Ubuntu 18以上，最好20以后，因为WireGuard本身在某个版本linux内核后加进了内核里面
Docker 最好20.10.10以上
```

拉wg\-easy的docker：

```Bash
sudo docker pull ghcr.io/wg-easy/wg-easy:latest
```

启动：

```Plain Text
sudo docker run -d \
  --name wg-easy \
  --restart unless-stopped \
  -e WG_HOST=120.48.128.6 \
  -e WG_ALLOWED_IPS="10.8.0.0/24,192.168.28.0/23" \
  -v ~/wg-easy:/etc/wireguard \
  -p 51820:51820/udp \
  -p 51821:51821/tcp \
  --cap-add NET_ADMIN \
  --cap-add SYS_MODULE \
  --sysctl net.ipv4.ip_forward=1 \
  --sysctl net.ipv4.conf.all.src_valid_mark=1 \
  ghcr.io/wg-easy/wg-easy:latest
```

验证：

```Plain Text
sudo docker ps
```

结果大概是这样子：

```Bash
CONTAINER ID   IMAGE                            COMMAND                  CREATED          STATUS                    PORTS                                                                                          NAMES
90982ad5df6e   ghcr.io/wg-easy/wg-easy:latest   "docker-entrypoint.s…"   50 minutes ago   Up 50 minutes (healthy)   0.0.0.0:51820->51820/udp, :::51820->51820/udp, 0.0.0.0:51821->51821/tcp, :::51821->51821/tcp   wg-easy
```

看到：

```Plain Text
51820/udp
51821/tcp
```

即可。

---

## 二、百度云 FRPS

已有：

```Plain Text
120.48.128.6
frps 0.63.0（这里版本随便）
```

配置`softether.toml`文件：

```Bash
sudo nano softether.toml
```

写进：

```Plain Text
bindPort = 33043
```

启动：

```Plain Text
./frps -c softether.toml
```

---

## 三、实验室部署 FRPC

下载：

```Plain Text
wget https://github.com/fatedier/frp/releases/download/v0.65.0/frp_0.65.0_linux_amd64.tar.gz
tar -zxvf frp_0.65.0_linux_amd64.tar.gz
```

在/home/ubuntu/frp\_0\.65\.0\_linux\_amd64目录下创建frpc\.toml（这里也可以不是这个目录下，但是配置 systemd 开机自启时，注意配置文件里面的内容目录地址），写入：

```Plain Text
serverAddr = "120.48.128.6"
serverPort = 33043
[[proxies]]
name = "wg"
type = "udp"
localIP = "127.0.0.1"
localPort = 51820
remotePort = 51820
[[proxies]]
name = "wg-web"
type = "tcp"
localIP = "127.0.0.1"
localPort = 51821
remotePort = 51821
```

每一套 wg\-easy 不能用相同的公网端口！

启动：

```Plain Text
./frpc -c frpc.toml
```

成功日志：

```Plain Text
login to server success
proxy added
start proxy success
```

---

## 四、配置 systemd 开机自启

创建：

```Plain Text
sudo nano /etc/systemd/system/frpc-wg.service
```

内容：

```Plain Text
[Unit]
Description=FRP Client for wg-easy
After=network.target

[Service]
Type=simple
ExecStart=/home/ubuntu/frp_0.65.0_linux_amd64/frpc -c /home/ubuntu/frp_0.65.0_linux_amd64/frpc.toml
Restart=always
RestartSec=5
User=ubuntu

[Install]
WantedBy=multi-user.target
```

启动：

```Plain Text
sudo systemctl daemon-reload
sudo systemctl enable frpc-wg
sudo systemctl start frpc-wg
```

查看：

```Plain Text
sudo systemctl status frpc-wg
journalctl -u frpc-wg -f
```

---

## 五、百度云安全组

必须放行：

```Plain Text
TCP 51821
UDP 51820
TCP 33043
```

注意：

很多人会误放：

```Plain Text
UDP 51821
```

正确的是：

```Plain Text
UDP 51820
```

因为 WireGuard 监听：

```Plain Text
51820/udp
```

---

## 六、创建客户端

wg\-easy 后台：

```Plain Text
http://127.0.0.1:51821
```

创建：

```Plain Text
比如命名为：karry-laptop
```

下载配置。

这里一个配置对应一个机器\~

---

## 七、检查客户端自动生成的配置

默认：

```Plain Text
AllowedIPs = 0.0.0.0/0, ::/0
```

会导致：

```Plain Text
所有流量走 VPN
可能断网
```

但是启动Docker的时候已经配置，这里需要在配置文件里检查一下：

```Plain Text
AllowedIPs = 10.8.0.0/24,192.168.28.0/23
```

表示：

```Plain Text
WireGuard VPN内部网段
10.8.0.x

实验室网段
192.168.28.x
192.168.29.x
```

走 VPN。

其余流量正常走本地网络。

---

## 八、验证

客户端：

```Plain Text
ping 10.8.0.1
ping 192.168.29.1
```

正常即可访问实验室局域网。

---

## 九、常见故障

### 没有 handshake

检查：

```Plain Text
UDP 51820
```

是否放行。

---

### 后台能打开，VPN连不上

一般是：

```Plain Text
TCP 51821 正常
UDP 51820 未放行
```

---

### 开 VPN 后断网

修改：

```Plain Text
AllowedIPs
```

不要使用：

```Plain Text
0.0.0.0/0
```

改为：

```Plain Text
10.8.0.0/24,192.168.28.0/23
```

---

### 查看 FRP 日志

```Plain Text
journalctl -u frpc-wg -f
```

---

### 查看 WireGuard 状态

```Plain Text
sudo docker exec wg-easy wg show
```

## 降低延时的重要的优化

wg\-easy 使用默认 Bridge 网络：

```Plain Text
docker run ...
-p 51820:51820/udp
-p 51821:51821/tcp
```

我们可以改为 Host Network，即去掉了一层 Docker 网络转发

停止旧容器：

```Plain Text
sudo docker stop wg-easy
sudo docker rm wg-easy
```

开启系统转发：

```Plain Text
sudo sysctl -w net.ipv4.ip_forward=1
sudo sysctl -w net.ipv4.conf.all.src_valid_mark=1
```

永久保存：

```Plain Text
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
echo "net.ipv4.conf.all.src_valid_mark=1" | sudo tee -a /etc/sysctl.conf
```

重新启动：

```Plain Text
sudo docker run -d \
  --name wg-easy \
  --network host \
  --restart unless-stopped \
  -e WG_HOST=120.48.128.6 \
  -e WG_ALLOWED_IPS="10.8.0.0/24,192.168.28.0/23" \
  -v ~/wg-easy:/etc/wireguard \
  --cap-add NET_ADMIN \
  --cap-add SYS_MODULE \
  ghcr.io/wg-easy/wg-easy:latest
```

添加 NAT：其中\-o后面接连接到局域网的网络接口

```Plain Text
sudo iptables -t nat -A POSTROUTING \
-s 10.8.0.0/24 \
-o enp3s0 \
-j MASQUERADE
```

## 下面仅对优化做解释，可以跳过

### 优化前（Bridge）

你最开始的启动方式：

```Plain Text
docker run \
-p 51820:51820/udp \
-p 51821:51821/tcp
```

网络结构：

```Plain Text
客户端
    │
    ▼
FRP
    │
    ▼
宿主机(192.168.28.234)
    │
    │ Docker Port Mapping
    ▼
docker0 (172.17.0.1)
    │
    ▼
wg-easy容器(172.17.0.2)
    │
    ▼
WireGuard
```

数据包实际上：

```Plain Text
UDP:51820
    │
    ▼
宿主机
    │
    ▼
iptables DNAT
    │
    ▼
docker0
    │
    ▼
容器
```

相当于：

```Plain Text
真实网络
 ↓
Docker NAT
 ↓
WireGuard
```

所以你当时看到：

```Plain Text
wg show
```

出现：

```Plain Text
endpoint: 172.17.0.1:xxxxx
```

---

### 优化后（Host）

启动方式：

```Plain Text
docker run \
--network host
```

结构变成：

```Plain Text
客户端
    │
    ▼
FRP
    │
    ▼
宿主机(192.168.28.234)
    │
    ▼
wg-easy
```

此时：

```Plain Text
容器
=
宿主机网络
```

没有：

```Plain Text
docker0
172.17.0.x
iptables DNAT
```

这些东西了。

---

### 少了什么

优化前：

```Plain Text
客户端
 ↓
FRP
 ↓
宿主机
 ↓
DNAT
 ↓
docker0
 ↓
veth pair
 ↓
容器
 ↓
WireGuard
```

优化后：

```Plain Text
客户端
 ↓
FRP
 ↓
宿主机
 ↓
WireGuard
```

直接少掉：

```Plain Text
DNAT
docker bridge
veth pair
```

## 不重要的tailscale

```Bash
1. 开启 IP 转发（持久化配置）
echo 'net.ipv4.ip_forward=1' | sudo tee /etc/sysctl.d/route.conf
sudo sysctl -p

2. 宣告子网路由（关键命令）
sudo tailscale up --advertise-routes=192.168.28.0/23

这样子就可以实现tailscale访问局域网，我只需要在局域网一台机器登录tailscale即可
```

