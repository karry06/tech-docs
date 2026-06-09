# 机械臂RTC异步推理

> 机械臂官方其实给出了一版文档，见下方：
>
> [PI0、PI0\.5 算法训练、推理 \(同步推理, RTC推理\)](https://my.feishu.cn/wiki/HNCWww8kpidDupk8norc8OPLn6d?from=from_copylink)
>
> 本文档将基于526真实环境做出一点修改
>
> 

# **一 、环境配置**

> 本部分已经配置到了192\.168\.29\.64的机器上，如果后续需要修改，再调整
>
> 

## 1\.1 下载源码:

```Plain Text
https://github.com/IMETA-Robotics/openpi.git
git checkout imeta_robotics
```

## 1\.2 创建conda虚拟环境 openpi 

- openpi要求python \>= 3\.11

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NDc1MmYyMjgwM2I3NzM0OWFlN2YyN2E3Mjc5OGIwYmRfYTVmNmY2M2Q2NDI5N2FjM2QxMzVlOWQ4Nzc3MGI0ZTVfSUQ6NzY0ODQ3NzA0NjUwMjQ2MDYwN18xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)

```Plain Text
conda create -n openpi python=3.11
conda activate openpi
```

- 在openpi环境安装 uv

```Plain Text
pip install uv
```

- 同步依赖并安装：

```Plain Text
GIT_LFS_SKIP_SMUDGE=1 uv sync
GIT_LFS_SKIP_SMUDGE=1 uv pip install -e .
```

## **安装环境可能遇到的问题点:**

1. 如果整体下载速度很慢，可以尝试换清华源加快速度 \(备选\)

```Plain Text
export UV_DEFAULT_INDEX="https://pypi.tuna.tsinghua.edu.cn/simple"
GIT_LFS_SKIP_SMUDGE=1 uv sync
GIT_LFS_SKIP_SMUDGE=1 uv pip install -e .
```



2. 下载安装lerobot环境的时候特别慢?  特别是在autodl云服务器上

可以提前在本地下载好，然后修改pyproject\.toml中的lerobot路径，替换为你的实际本地路径

```Plain Text
# 需要切换到 0cf864870cf29f4738d3ade893e6fd13fbd7cdb5 ，因为openpi用的是这个commit版本的代码
git clone https://github.com/huggingface/lerobot.git 
git checkout 0cf864870cf29f4738d3ade893e6fd13fbd7cdb5 
```

- **修改openpi里的pyproject\.toml 文件， 将上面lerobot那行注释掉，下面那行lerobot打开, 修改成你的实际路径**

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZmVlZThkZGJjYzY3YzllMjQwZWIyYzczMzk2MjUyMGZfYzY0MWI2ZTAwN2E3YWU1YTA3NDRhZTM0YjdjZDJkZTlfSUQ6NzY0ODQ3NzA0NTIzNTg3OTExMV8xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)

- 然后继续执行 

```Plain Text
GIT_LFS_SKIP_SMUDGE=1 uv sync
GIT_LFS_SKIP_SMUDGE=1 uv pip install -e .

# for lerobot 
conda install ffmpeg -c conda-forge

# 如果后续解析lerobot dataset有问题，安装以下版本
# lerobot环境安装参考：https://huggingface.co/docs/lerobot/installation
conda install ffmpeg=7.1.1 -c conda-forge
```

# **二、模型推理**

## **2\.1 数据集评估 （建议）**

模型训练完成后，可以先在数据集上评估一下。

### **2\.1\.1  **有个** eval\_dataset\.sh 脚本，修改这两个参数**：

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZTA2MWE2ZjUwZDBmZTBmMjkzNzU0OTJhZGRkZjU0MDhfYmNlY2NjNjcyY2Y0ZWYzMDkyZmY3Mjk0NDBkZDQ5Y2NfSUQ6NzY0ODQ3NzUxNzI5MjI3NjY5NV8xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)

- **`--policy.config`** 参数根据自己的训练配置名称来修改

- **`--policy.dir`** 模型所在目录

```Plain Text
bash scripts/eval_dataset.sh
```

### **2\.1\.2   评估完会生成一个 eval\_dataset\.png \(名称可能有变化\)， 如下：**

预测曲线 和 真实action大体一致，可以初步判断模型训练没有问题。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MWRjN2JmYzFlZGVkNmM2MTkxMzY2NGZhYTQ0YmJkNWVfYjY1NGIwMzg1NzMzYTkxYWE1NGU5MDE2ZmNmNzJhZWNfSUQ6NzY0ODQ3NzUyMTA3NTI5MzE1OF8xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)



## 2\.2 真机部署 （****运行前好好看一下相关脚本 和 代码****）

### **2\.2\.1  ubuntu 20\.04  ros1  noetic 平台**

可用ros1来做模型的真机部署，需要修改 **scripts/inference\_ros1/eval\_real\_robot\.sh 脚本：**

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YzdiZjg0ZjcyM2NmZjE1ZmI3NTVlNDljZGZmZDk3YzhfODMyMTBmOWI3NzU4MjYyNDc0M2JjZDdlZGRlYTAzNjlfSUQ6NzY0ODQ3NzUxOTc4NzgwNTY3MV8xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)

三个地方需要修改：

- **`LD_LIBRARY_PATH`**：将路径换成你的 Conda 环境路径

- **`--policy.config`** 参数根据自己的训练配置名称来修改

- **`--policy.dir`** 模型所在目录

```Plain Text
### 1. 启动机械臂ros驱动
**根据你的机械臂驱动来启动 launch 文件**

### 2. 启动相机ros驱动
**根据你的相机驱动来启动 launch 文件**

### 3. 启动模型推理脚本
## 首先要加载ROS环境，因为在模型推理输出的控制指令 会以rostopic的形式与机械臂驱动进行通信.
**## 如果使用的是python sdk:**
cd y1_sdk_python/y1_ros
source devel/setup.bash

**## 如果使用的是c++ sdk:**
cd y1_sdk
source devel/setup.bash

bash scripts/inference_ros1/eval_real_robot.sh
```



### **2\.2\.2 ubuntu 22\.04  平台**

**因为ros2 humble 需要python 3\.10 和 openpi 的python 3\.11版本冲突, 所以直接用一下 纯python sdk部署的方式即可**

### 2\.2\.3 纯python sdk部署 

不需要conda虚拟环境, 退出conda的所有环境

代码在 **scripts/inference\_python/ 目录下**

#### **2\.2\.3\.1  安装y1\_sdk \(机械臂的 python sdk\)**

```Plain Text
cd openpi/

## 将~/IMETA_LAB/y1_sdk_python/y1_sdk/ 改为你自己的路径
uv pip install ~/IMETA_LAB/y1_sdk_python/y1_sdk/
```

#### 2\.2\.3\.2 安装相机 sdk : 

> 本部分根据实际情况有所调整，526是两台奥比中光的DCW2相机
>
> 

1. **奥比中光**

**奥比中光 SDK 参考资料：**

<LinkCard
  title="PyOrbbecSDK · SDK V1"
  url="https://github.com/orbbec/pyorbbecsdk/tree/main"
  description="main 分支，Orbbec SDK V1"
/>

<LinkCard
  title="PyOrbbecSDK · SDK V2"
  url="https://github.com/orbbec/pyorbbecsdk/tree/v2-main"
  description="v2-main 分支，Orbbec SDK V2"
/>

<LinkCard
  title="Orbbec SDK V2 Python Wrapper"
  url="https://orbbec.github.io/pyorbbecsdk/source/2_installation/install_the_package.html#installation"
  description="官方安装说明"
/>

首先，安装相机 SDK：
<LinkCard
  title="相机SDK"
  url="https://my.feishu.cn/wiki/HNCWww8kpidDupk8norc8OPLn6d#share-QrUndf77nobYTZxlYqVc32VPnhg"
  description="官方飞书文档"
/>


```Plain Text
# Dabai DCW2相机暂不支持 Orbbec SDK V2 , V1版本的sdk安装比较复杂
uv pip install pyorbbecsdk-1.3.1-cp311-cp311-linux_x86_64.whl
```

**然后, 可运行以下程序查询相机序列号:**

```Plain Text
cd ~/openpi_imeta
export LD_LIBRARY_PATH=$PWD/.venv/lib/python3.11/site-packages:$LD_LIBRARY_PATH
uv run python scripts/inference_python/utils/list_orbbc_serial.py
```

**最后, 修改** **scripts/inference\_python/ real\_robot\_env\.py 文件中的序列号**

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MDcyMTQyZjA0YWY0MjY2NzYyODc1ZDQ3YTIwZjU5OTlfY2Y5OTNhNjI4YzI1OWY2ODY4ZmE3NzExMjRkNmRjNWJfSUQ6NzY0ODQ3NzUxOTI2NzgxMDUwM18xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)

如果是realsense相机, 可使用 uv pip install 来安装相机驱动\. 

可以参考 orbbec\_camera\.py 文件,  继承BaseCamera基类来实现一个realsense的子类



#### 2\.2\.3\.3 同步推理\(推理方式一\) : 

首先, 检查real\_robot\_env\.py里机械臂id是否正确, 按自己的can id 修改: 

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MDI3OGVhNjJkYmU5YTBmMjYzYThiMmZkZmQ5ZWExYzRfOTVhODljNTdjNTg4NjA1MjU1NGFlOTJlNGQzOGUyNTdfSUQ6NzY0ODQ3NzUxOTM4OTQ2MTczN18xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)

**然后, RealRobotEnv 默认参数为 V4l2Camera, 如果使用的是奥比相机, 需要加个参数 camera\_type="orbbec"**

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YWIyNzZkMDEyMzQ1NGY5MDA4NDY3ODljYmI4YmNlZWFfMTBjNDYzNTMwOTFjNDUwMzkwZDJmYWRjMzZmMGEwNDZfSUQ6NzY0ODQ3NzUyMDM1NDAwNDIwNF8xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)

**最后, 修改scripts/inference\_ros1/eval\_real\_robot\.sh 脚本**

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=N2VlNTVlZTY2Yzk2YjVhNjM5NWZhZTFkM2UxYTZkMWJfZDNiMzAzMTE5MzUyMTY5ZDQ4ZTJlYjk2NTUyZmE5ZjdfSUQ6NzY0ODQ3NzUyMjI0NTUyMDM2NV8xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)

三个地方需要修改：

- **`LD_LIBRARY_PATH`**：将路径换成你的 Conda 环境路径

- **`--policy.config`** 参数根据自己的训练配置名称来修改

- **`--policy.dir`** 模型所在目录

```Plain Text
bash scripts/inference_python/eval_real_robot.sh
```

#### 2\.2\.3\.3 RTC异步推理\(推理方式二\) : 

以pi05为例: 

首先, 在config\.py文件里新增一个用于推理的配置, 与训练的config区别就是 model不同

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=OTIyZTY1MTkzYzQ4YjMxMzkwZGM4YjI2NDU5MGVkYjJfNTViYWQxZTg5MWE3ODM1NDZkNTU1MzMwYmY2N2M5ODlfSUQ6NzY0ODQ3NzUxOTQwNjE0MDYzNV8xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)

可以是这样子：

```Python
# pi05 RTC inference single arm
TrainConfig(
    name="pi05_rtc_inference_single_arm",
    model=pi0_config.Pi0RTCConfig(pi05=True),
    data=LeRobotAlohaDataConfig(
        repo_id="openpi/pick_up_screws",
        use_delta_joint_actions=False,
        adapt_to_pi=False,
        repack_transforms=_transforms.Group(
            inputs=[
                _transforms.RepackTransform(
                    {
                        "images": {
                            "cam_high": "observation.images.cam_high",
                            "cam_right_wrist": "observation.images.cam_right_wrist",
                        },
                        "state": "observation.state",
                        "actions": "action",
                        "prompt": "prompt",
                    }
                )
            ]
        ),
        base_config=DataConfig(
            prompt_from_task=True,
        ),
    ),
    weight_loader=weight_loaders.CheckpointWeightLoader(
        "gs://openpi-assets/checkpoints/pi05_base/params"
    ),
    num_train_steps=30000,
    save_interval=5000,
    keep_period=10000,
    batch_size=32,
    fsdp_devices=1,
),
```

然后**检查修改和启动**第一个脚本: 

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MmFiZTY0YzMyOGFlNDU2MGZlNzczMDYzMTBmMmM4OWFfZjNjZTg4YmQ0NWQwNDVjMmRkY2E2YTE3Y2Q1OWYwYjlfSUQ6NzY0ODQ3NzUyMTg4MDY0ODg4M18xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)

```Plain Text
bash scripts/inference_python/server_policy.sh
```



---

客户端这边，首先是启动can：

```Bash
cd ~/y1_sdk_python/y1_ros2/can_scripts

bash start_can0.sh
```

最后**检查修改和启动**第二个脚本:

**如果还是会有大的抖动, 根据模型推理的延迟时间 来 修改调试 RTC相关参数, 不会可以问 deepseek  , gpt, 建议使用Codex**

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=OTc3OWJlZGQxMmZmOGJjZmVhZjgyOTU4YmEzOGJjYmVfZWExZWRmYmI2M2VhYjQxNWEyNmVmZjY1MWQ2NDc4NGJfSUQ6NzY0ODQ3NzUyMTE5Mjg5NzUwOF8xNzgwOTkxNjg2OjE3ODEwNzgwODZfVjM)

```Plain Text
bash scripts/inference_python/y1_inference_rtc.sh
```



