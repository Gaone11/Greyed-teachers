// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs";
import path from "path";
var skipProblematicFiles = () => ({
  name: "skip-problematic-files",
  configResolved(config) {
    const originalCopyDir = config.publicDir;
    if (originalCopyDir) {
      const problematicFiles = ["Logo PNG copy.png", "Logo PNG.png"];
      problematicFiles.forEach((file) => {
        const filePath = path.join(process.cwd(), "public", file);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (e) {
        }
      });
    }
  }
});
var vite_config_default = defineConfig({
  plugins: [react(), skipProblematicFiles()],
  // Explicitly define the root directory
  root: process.cwd(),
  publicDir: "public",
  build: {
    rollupOptions: {
      input: {
        main: "index.html"
      }
    },
    copyPublicDir: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3Qgc2tpcFByb2JsZW1hdGljRmlsZXMgPSAoKTogUGx1Z2luID0+ICh7XG4gIG5hbWU6ICdza2lwLXByb2JsZW1hdGljLWZpbGVzJyxcbiAgY29uZmlnUmVzb2x2ZWQoY29uZmlnKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxDb3B5RGlyID0gKGNvbmZpZyBhcyBhbnkpLnB1YmxpY0RpcjtcbiAgICBpZiAob3JpZ2luYWxDb3B5RGlyKSB7XG4gICAgICBjb25zdCBwcm9ibGVtYXRpY0ZpbGVzID0gWydMb2dvIFBORyBjb3B5LnBuZycsICdMb2dvIFBORy5wbmcnXTtcbiAgICAgIHByb2JsZW1hdGljRmlsZXMuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3B1YmxpYycsIGZpbGUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgICAgICAgZnMudW5saW5rU3luYyhmaWxlUGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgc2tpcFByb2JsZW1hdGljRmlsZXMoKV0sXG4gIC8vIEV4cGxpY2l0bHkgZGVmaW5lIHRoZSByb290IGRpcmVjdG9yeVxuICByb290OiBwcm9jZXNzLmN3ZCgpLFxuICBwdWJsaWNEaXI6ICdwdWJsaWMnLFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46ICdpbmRleC5odG1sJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjb3B5UHVibGljRGlyOiB0cnVlLFxuICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUE0QjtBQUM5UCxPQUFPLFdBQVc7QUFFbEIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBRWpCLElBQU0sdUJBQXVCLE9BQWU7QUFBQSxFQUMxQyxNQUFNO0FBQUEsRUFDTixlQUFlLFFBQVE7QUFDckIsVUFBTSxrQkFBbUIsT0FBZTtBQUN4QyxRQUFJLGlCQUFpQjtBQUNuQixZQUFNLG1CQUFtQixDQUFDLHFCQUFxQixjQUFjO0FBQzdELHVCQUFpQixRQUFRLFVBQVE7QUFDL0IsY0FBTSxXQUFXLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxVQUFVLElBQUk7QUFDeEQsWUFBSTtBQUNGLGNBQUksR0FBRyxXQUFXLFFBQVEsR0FBRztBQUMzQixlQUFHLFdBQVcsUUFBUTtBQUFBLFVBQ3hCO0FBQUEsUUFDRixTQUFTLEdBQUc7QUFBQSxRQUNaO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFDRjtBQUdBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcscUJBQXFCLENBQUM7QUFBQTtBQUFBLEVBRXpDLE1BQU0sUUFBUSxJQUFJO0FBQUEsRUFDbEIsV0FBVztBQUFBLEVBQ1gsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsTUFBTTtBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsSUFDQSxlQUFlO0FBQUEsRUFDakI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
