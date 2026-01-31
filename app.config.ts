// app.config.ts
export default defineAppConfig({
  ui: {
    modal: {
      content: "rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden max-w-sm w-[calc(100vw-2rem)]",
      transition: "transition-all duration-200 ease-out",
    },
    toast: {
      slots: {
        icon: "size-5!",
        root: "items-center!",
      },
    },
    tabs:{
      slots:{
              root: 'sm:px-4 py-0',
      list: `tabs-list overflow-x-auto overflow-y-hidden border-b-0 justify-start py-1.5 border-none  sm:justify-start  items-center `,
      indicator: 'h-1.5! bottom-auto! bottom-[-2px]!',
      trigger: 'font-semibold cursor-pointer shrink-0 text-[13px] lg:text-sm',
      content: 'py-4',
      }
    }
  },
});
