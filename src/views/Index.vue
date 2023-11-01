<template>
  <div class="app-home">
    <div class="left-nav">
      <div class="flex item desc middle">
        <div class="flex-grow">本地播放列表</div>

        <t-tooltip content="添加播放">
          <t-icon
            class="hover"
            name="plus"
            size="20"
            style="margin-right: -16px"
            @click="
              addDialog.data = {};
              addDialog.show = true;
            "
          />
        </t-tooltip>
      </div>
      <div v-if="!data.list" class="mt-4 item gray" style="font-size: 12px">
        播放列表为空，点击
        <a
          @click="
            addDialog.data = {};
            addDialog.show = true;
          "
        >
          添加
        </a>
      </div>
      <template v-else>
        <div
          v-for="item in data.list"
          class="mt-8 item video singe-line"
          :class="{ active: item.url === data.actived?.url }"
          :title="item.url"
          @click="goPlay(item)"
        >
          {{ item.name }}
        </div>
      </template>

      <t-button
        theme="primary"
        shape="round"
        variant="base"
        class="add"
        @click="
          addDialog.data = {};
          addDialog.show = true;
        "
      >
        <template #icon>
          <t-icon name="plus" />
        </template>
        添加播放
      </t-button>
    </div>
    <div class="view" v-if="data.actived">
      <div class="flex middle">
        <h5 class="flex-grow">{{ data.actived.name }}</h5>
        <t-tooltip content="编辑">
          <t-icon
            name="edit"
            class="mr-8 hover"
            @click="
              editDialog.data = Object.assign({}, data.actived);
              editDialog.show = true;
            "
          />
        </t-tooltip>

        <t-tooltip content="删除">
          <t-popconfirm content="确认删除吗" @confirm="del">
            <t-icon name="delete" class="hover" />
          </t-popconfirm>
        </t-tooltip>
      </div>
      <div class="mt-4 desc">{{ data.actived.url }}</div>

      <div>
        <video id="video" autoplay muted controls></video>
      </div>
    </div>

    <t-dialog
      v-if="addDialog.show"
      :visible="true"
      header="添加播放"
      @confirm="onAdd"
      @close="addDialog.show = false"
      :width="600"
    >
      <t-form class="mt-16">
        <t-form-item label="播放名称" help="用于左侧列表显示" name="name">
          <t-input v-model="addDialog.data.name"></t-input>
        </t-form-item>

        <t-form-item
          label="播放地址"
          help="rtsp://用户名:密码@IP:端口/xxx/xxx?param1=abc"
          name="url"
          style="margin-top: 16px"
        >
          <t-input v-model="addDialog.data.url"></t-input>
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-dialog
      v-if="editDialog.show"
      :visible="true"
      header="编辑播放"
      @confirm="onSave"
      @close="editDialog.show = false"
      :width="600"
    >
      <t-form class="mt-16">
        <t-form-item label="播放名称" help="用于左侧列表显示" name="name">
          <t-input v-model="editDialog.data.name"></t-input>
        </t-form-item>

        <t-form-item
          label="播放地址"
          help="rtsp://用户名:密码@IP:端口/xxx/xxx?param1=abc"
          name="url"
          style="margin-top: 16px"
        >
          <t-input v-model="editDialog.data.url"></t-input>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, reactive } from 'vue';
import axios from 'axios';
import { MessagePlugin } from 'tdesign-vue-next';

const data = reactive<any>({});

const addDialog = reactive<any>({});
const editDialog = reactive<any>({});

onBeforeMount(() => {
  getList();
  if (data.actived) {
    goPlay(data.actived);
  }
});

onMounted(() => {
  if (data.actived) {
    play(data.actived);
  }
});

const getList = () => {
  let json = localStorage.getItem('rtspList');
  if (json) {
    data.list = JSON.parse(json);
    json = localStorage.getItem('rtspPlaying');
    if (json) {
      data.actived = JSON.parse(json);
    }
  } else {
    addDialog.data = {};
    addDialog.show = true;
  }
};

const onAdd = () => {
  if (!addDialog.data.name) {
    MessagePlugin.error('播放名称不能为空');
    return;
  }
  if (!addDialog.data.url) {
    MessagePlugin.error('播放地址不能为空');
    return;
  }
  if (!data.list) {
    data.list = [];
  }

  if (data.actived) {
    const i = data.list.findIndex(
      (item: any) => item.url === addDialog.data.url
    );
    if (i > -1) {
      MessagePlugin.error('已经存在相同播放地址');
      return;
    }
  }

  data.list.push(addDialog.data);
  localStorage.setItem('rtspList', JSON.stringify(data.list));
  addDialog.show = false;

  goPlay(addDialog.data);
};

const onSave = () => {
  if (!editDialog.data.name) {
    MessagePlugin.error('播放名称不能为空');
    return;
  }
  if (!editDialog.data.url) {
    MessagePlugin.error('播放地址不能为空');
    return;
  }

  if (data.actived) {
    const item = data.list.find(
      (item: any) => item.url === editDialog.data.url
    );
    if (item && item.url !== data.actived.url) {
      MessagePlugin.error('存在相同地址的其他播放数据');
      return;
    }
  }

  const i = data.list.findIndex((item: any) => item.url === data.actived.url);
  data.list[i].name = editDialog.data.name;
  data.list[i].url = editDialog.data.url;
  localStorage.setItem('rtspList', JSON.stringify(data.list));

  editDialog.show = false;

  goPlay(editDialog.data);
};

const goPlay = (item: any) => {
  if (data.actived?.url !== item.url) {
    setTimeout(() => {
      play(item);
    }, 100);
  }
  data.actived = item;
  localStorage.setItem('rtspPlaying', JSON.stringify(item));
};

const play = (item: any) => {
  data.stream = new MediaStream();
  // @ts-ignore
  document.getElementById('video').srcObject = data.stream;

  if (data.connection) {
    data.connection.close();
  }

  const connection = new RTCPeerConnection({
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302'],
      },
    ],
  });

  connection.addTransceiver('video', {
    direction: 'sendrecv',
  });
  connection.addTransceiver('audio', {
    direction: 'sendrecv',
  });

  // 连接状态变化，需要协商通信
  connection.onnegotiationneeded = async () => {
    // 设置本地信令
    let offer = await connection.createOffer();
    await connection.setLocalDescription(offer);

    // 发送给对方
    const ret: any = await axios.post('/api/rtsp/webrtc', {
      rtspUrl: item.url,
      // @ts-ignore
      sdp: btoa(connection.localDescription.sdp),
    });

    if (ret) {
      connection.setRemoteDescription(
        new RTCSessionDescription({
          type: 'answer',
          sdp: atob(ret.sdp),
        })
      );
    }
  };
  // 添加远程流
  connection.ontrack = (event: any) => {
    data.stream.addTrack(event.track);
  };

  data.connection = connection;
};

const del = () => {
  data.list = data.list.filter((item: any) => item.url !== data.actived.url);
  data.actived = undefined;
  localStorage.setItem('rtspList', JSON.stringify(data.list));
  localStorage.removeItem('rtspPlaying');
};
</script>

<style lang="postcss" scoped>
.app-home {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #f3f4f5;

  .left-nav {
    position: relative;
    flex-shrink: 0;
    width: 240px;
    height: 100%;
    padding: 20px 0;
    background-color: #fff;

    .item {
      margin: 4px;
      padding: 6px 16px;
      border-radius: 2px;
    }

    .video {
      cursor: pointer;
      &:hover {
        background-color: var(--color-border);
      }

      &.active {
        color: #ffffff;
        background-color: var(--color-primary);
      }
    }

    & > .add {
      width: calc(100% - 40px);
      position: absolute;
      margin: 20px;
      bottom: 0;
    }
  }

  .view {
    padding: 30px;
    flex-grow: 1;
  }

  video {
    margin-top: 10px;
    width: 100%;
    height: calc(100vh - 160px);
  }
}
</style>
