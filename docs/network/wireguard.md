# WireGuard 配置

WireGuard 是轻量、现代的 VPN 协议，配置简单且性能良好。

## 基础概念

- **Interface**：本机 WireGuard 网络接口。
- **Peer**：允许通信的远端节点。
- **PrivateKey**：本机私钥，不应对外泄露。
- **PublicKey**：由私钥生成，用于节点间认证。
- **AllowedIPs**：允许通过该 Peer 路由的网段。

## 生成密钥

```bash
wg genkey | tee privatekey | wg pubkey > publickey
```

## 客户端配置示例

```ini
[Interface]
PrivateKey = <client-private-key>
Address = 10.0.0.2/24

[Peer]
PublicKey = <server-public-key>
Endpoint = example.com:51820
AllowedIPs = 10.0.0.0/24
PersistentKeepalive = 25
```

## 检查状态

```bash
sudo wg show
```
