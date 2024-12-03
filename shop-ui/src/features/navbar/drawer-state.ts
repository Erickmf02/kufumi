import { reactive } from "vue";

export const drawerState = reactive({
  isDrawerOpen: false,
});

export function hideDrawer(){
  drawerState.isDrawerOpen = false;
  const body = document.querySelector('body');
  body?.classList.remove('overflow-hidden')
}

export function showDrawer(){
  console.log(drawerState)
  drawerState.isDrawerOpen = true;
  const body = document.querySelector('body');
  body?.classList.add('overflow-hidden')
}