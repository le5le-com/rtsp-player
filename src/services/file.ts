import axios from 'axios';

export async function upload(blob: Blob, shared = false, filename = '') {
  const form = new FormData();
  form.append('directory', filename);
  form.append('shared', shared + '');
  form.append('file', blob);
  const ret: any = await axios.post('/api/image', form);
  if (ret.error) {
    return null;
  }

  return ret;
}

export async function delImage(image: string) {
  const ret: any = await axios.delete('/api' + image);
  if (ret.error) {
    return false;
  }

  return true;
}

export async function addImage(image: string) {
  const ret: any = await axios.post('/api/user/image', { image });
  if (ret.error) {
    return '';
  }

  return ret.id;
}

export function filename(str: string) {
  const i = str.lastIndexOf('.');
  return str.substring(0, i);
}

const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
export function formatBytes(size: number) {
  let l = 0;
  let n = size / 1024;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return Math.round(n * 100) / 100 + ' ' + units[l];
}
