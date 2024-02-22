<template>
  <div class="app-header">
    <a class="logo" :href="enterprise.home" target="_blank">
      <img src="/logo.png" />
      乐吾乐
    </a>
    <span class="mr-24 title"> - RTSP播放器 </span>
    <div class="flex-grow"></div>
    <t-dropdown
      :minColumnWidth="160"
      :maxHeight="500"
      :delay="[10, 150]"
      overlayClassName="custom-dropdown"
      style="margin-right: 32px"
    >
      <a> 帮助 <t-icon name="chevron-down" size="16" /></a>
      <t-dropdown-menu>
        <t-dropdown-item
          v-for="item in enterprise.helps"
          :divider="item.divider"
        >
          <a :href="item.url" target="_blank">{{ item.name }}</a>
        </t-dropdown-item>
      </t-dropdown-menu>
    </t-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { useEnterprise } from '@/services/enterprise';

const { enterprise } = useEnterprise();
</script>

<style lang="postcss" scoped>
.app-header {
  height: 50px;
  position: sticky;
  top: 0;
  box-shadow: -4px 0px 10px 0px rgba(0, 10, 38, 0.36);
  z-index: 10;

  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow-x: overlay;

  .logo {
    display: flex;
    align-items: center;
    margin-right: 4px;
    color: var(--color-title);
    font-weight: 700;
    flex-shrink: 0;

    background: #ffffff;
    height: 32px;
    border-radius: 16px;

    img {
      background: #ffffff;
      width: 28px;
      border-radius: 15px;
      height: 28px;
      margin-left: -2px;
      margin-right: 2px;
      padding: 2px;
    }
  }

  a {
    color: var(--color);
    font-size: 14px;
    text-decoration: none;
    margin: 0 18px;

    &:hover {
      color: var(--color-primary);
    }
  }

  & > a {
    line-height: 36px;
  }

  & > .search {
    display: flex;
    align-items: center;
    padding: 12px;
    height: 100%;
    background: #f7f8fa;
    border-radius: 2px;
    margin: 0 18px;

    input {
      width: 200px;
      background: none;
      outline: none;
      border: none;
    }
    svg {
      flex-shrink: 0;
      margin-left: 12px;
      cursor: pointer;
    }

    &:hover {
      svg {
        color: var(--color-primary);
      }
    }
  }

  :deep(.t-avatar) {
    background: none;
  }
}

:deep(.username) {
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
}

:deep(.btn) {
  color: var(--color-bland) !important;
  border: 1px solid;
  padding: 2px 10px;
  border-radius: 2px;
  &:hover {
    color: var(--color-bland-hover) !important;
  }
}

:deep(.username) {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
