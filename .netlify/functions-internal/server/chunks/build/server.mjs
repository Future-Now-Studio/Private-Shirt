import { hasInjectionContext, getCurrentInstance, inject, createApp, provide, toRef, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, shallowRef, isReadonly, isRef, isShallow, isReactive, toRaw, defineAsyncComponent, mergeProps, ref, computed, getCurrentScope, watch, useSSRContext } from 'vue';
import { l as hasProtocol, m as isScriptProtocol, n as joinURL, w as withQuery, o as sanitizeStatusCode, p as getContext, $ as $fetch, q as createHooks, t as executeAsync, c as createError$1, v as toRouteMatcher, x as createRouter$1, y as defu } from '../nitro/nitro.mjs';
import { u as useHead$1, h as headSymbol, b as baseURL } from '../routes/renderer.mjs';
import { createMemoryHistory, createRouter, START_LOCATION, useRouter as useRouter$1 } from 'vue-router';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderStyle, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  var _a;
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.17.5";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...((_a = options.ssrContext) == null ? void 0 : _a.payload) || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b, _c, _d;
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin2.dependsOn) == null ? void 0 : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin2.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) && ((_d = plugin2.env) == null ? void 0 : _d.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance || (nuxtAppInstance = getNuxtAppCtx(id).tryUse());
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to || (to = "/");
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = (options == null ? void 0 : options.external) || isExternalHost;
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value || (error2.value = nuxtError);
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => Promise.resolve().then(() => index)
  },
  {
    name: "checkout",
    path: "/checkout",
    component: () => Promise.resolve().then(() => checkout)
  },
  {
    name: "ready-to-buy",
    path: "/ready-to-buy",
    component: () => Promise.resolve().then(() => readyToBuy)
  },
  {
    name: "product-detail",
    path: "/product-detail",
    component: () => Promise.resolve().then(() => productDetail)
  },
  {
    name: "grossbestellung",
    path: "/grossbestellung",
    component: () => Promise.resolve().then(() => grossbestellung)
  },
  {
    name: "order-confirmation",
    path: "/order-confirmation",
    component: () => Promise.resolve().then(() => orderConfirmation)
  },
  {
    name: "customization-creator",
    path: "/customization-creator",
    component: () => Promise.resolve().then(() => customizationCreator)
  }
];
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = (route == null ? void 0 : route.meta.key) ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index2) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index2]) == null ? void 0 : _a.components) == null ? void 0 : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    let position = savedPosition || void 0;
    if (!position && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, "instant", position));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, "instant", position)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, scrollBehaviorType, position) {
  if (position) {
    return position;
  }
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: scrollBehaviorType
    };
  }
  return { left: 0, top: 0, behavior: scrollBehaviorType };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware || (nuxtApp._middleware = {
      global: [],
      named: {}
    });
    useError();
    if (!((_b = nuxtApp.ssrContext) == null ? void 0 : _b.islandContext)) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if ((failure == null ? void 0 : failure.type) === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if ((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from) => {
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function injectHead(nuxtApp) {
  var _a;
  const nuxt = nuxtApp || tryUseNuxtApp();
  return ((_a = nuxt == null ? void 0 : nuxt.ssrContext) == null ? void 0 : _a.head) || (nuxt == null ? void 0 : nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  }));
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4
];
const _export_sfc = (sfc, props2) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props2) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$f = {
  __name: "NotificationBar",
  __ssrInlineRender: true,
  setup(__props) {
    const notificationMessages = ref([
      "Kostenfreier Versand ab 50€",
      "Abholung im Store am nächsten Tag bei Bestellungen bis 12 Uhr"
    ]);
    const currentNotificationMessage = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-900 text-white text-center py-2 text-sm font-medium overflow-hidden relative h-8" }, _attrs))} data-v-8aa7b3ef><span data-v-8aa7b3ef>${ssrInterpolate(notificationMessages.value[currentNotificationMessage.value])}</span></div>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NotificationBar.vue");
  return _sfc_setup$f ? _sfc_setup$f(props2, ctx) : void 0;
};
const NotificationBar = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-8aa7b3ef"]]);
const _imports_0$2 = "" + __buildAssetsURL("group-25.BH3ZzPJz.svg");
const _sfc_main$e = {
  __name: "Header",
  __ssrInlineRender: true,
  props: {
    cartItemCount: {
      type: Number,
      default: 0
    }
  },
  emits: ["navigate", "toggleCart"],
  setup(__props) {
    const fertigeProdukteHover = ref(false);
    const submenuCategories = [
      { name: "Männer", id: "maenner" },
      { name: "Frauen", id: "frauen" },
      { name: "Kinder", id: "kinder" },
      { name: "Accessoires", id: "accessoires" },
      { name: "Arbeitskleidung", id: "arbeitskleidung" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm" }, _attrs))} data-v-681acbd6><nav class="container mx-auto px-6 py-4 flex justify-between items-center" data-v-681acbd6><div class="text-2xl font-bold text-gray-900 cursor-pointer" data-v-681acbd6><img${ssrRenderAttr("src", _imports_0$2)} alt="private-shirt.de Logo" class="h-8" data-v-681acbd6></div><div class="hidden lg:flex items-center space-x-8" data-v-681acbd6><a class="nav-link relative" data-v-681acbd6> Fertige Produkte </a><a class="nav-link" data-v-681acbd6>Gestalten / Creator</a><a class="nav-link" data-v-681acbd6>Großbestellung</a></div><div data-v-681acbd6><button class="relative ml-4 p-2 rounded-full hover:bg-gray-100 transition" data-v-681acbd6><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-681acbd6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" data-v-681acbd6></path></svg>`);
      if (__props.cartItemCount > 0) {
        _push(`<span class="absolute -top-1 -right-1 bg-[#D8127D] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" data-v-681acbd6>${ssrInterpolate(__props.cartItemCount)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><button class="lg:hidden ml-4" data-v-681acbd6><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-681acbd6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" data-v-681acbd6></path></svg></button></div></nav>`);
      if (fertigeProdukteHover.value) {
        _push(`<div class="fixed left-0 right-0 top-[72px] z-50 bg-gray-100 border-b border-gray-200 shadow-sm" data-v-681acbd6><div class="container mx-auto px-6 flex space-x-8 py-2 justify-center" data-v-681acbd6><!--[-->`);
        ssrRenderList(submenuCategories, (cat) => {
          _push(`<button class="text-gray-700 hover:text-[#D8127D] font-medium px-3 py-1 rounded transition" data-v-681acbd6>${ssrInterpolate(cat.name)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$e ? _sfc_setup$e(props2, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-681acbd6"]]);
const _sfc_main$d = {
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-[#0a3a47] text-white" }, _attrs))} data-v-6492d0c3><div class="container mx-auto px-6 py-12" data-v-6492d0c3><div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8" data-v-6492d0c3><div class="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0" data-v-6492d0c3><img${ssrRenderAttr("src", _imports_0$2)} alt="private-shirt.de Logo" class="h-8 mb-4" data-v-6492d0c3><p class="text-white text-sm opacity-80" data-v-6492d0c3>Dein Druck. Deine Idee. Dein Shirt.</p></div><div data-v-6492d0c3><h4 class="font-semibold mb-3" data-v-6492d0c3>Shop</h4><ul class="space-y-2 text-sm" data-v-6492d0c3><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>T-Shirts</a></li><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>Hoodies</a></li><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>Tassen</a></li><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>Accessoires</a></li></ul></div><div data-v-6492d0c3><h4 class="font-semibold mb-3" data-v-6492d0c3>Service</h4><ul class="space-y-2 text-sm" data-v-6492d0c3><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>Großbestellungen</a></li><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>Hilfe &amp; FAQ</a></li><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>Kontakt</a></li></ul></div><div data-v-6492d0c3><h4 class="font-semibold mb-3" data-v-6492d0c3>Unternehmen</h4><ul class="space-y-2 text-sm" data-v-6492d0c3><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>Über uns</a></li><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>Jobs</a></li><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>Nachhaltigkeit</a></li></ul></div><div data-v-6492d0c3><h4 class="font-semibold mb-3" data-v-6492d0c3>Legal</h4><ul class="space-y-2 text-sm" data-v-6492d0c3><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>Impressum</a></li><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>Datenschutz</a></li><li data-v-6492d0c3><a href="#" class="footer-link" data-v-6492d0c3>AGB</a></li></ul></div></div><div class="mt-12 border-t border-[#D8127D] pt-8 flex flex-col md:flex-row justify-between items-center" data-v-6492d0c3><p class="text-sm text-white opacity-80" data-v-6492d0c3>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} private-shirt.de. Alle Rechte vorbehalten.</p><div class="flex space-x-4 mt-4 md:mt-0" data-v-6492d0c3><span class="text-xs opacity-70" data-v-6492d0c3>VISA</span><span class="text-xs opacity-70" data-v-6492d0c3>Mastercard</span><span class="text-xs opacity-70" data-v-6492d0c3>PayPal</span><span class="text-xs opacity-70" data-v-6492d0c3>DHL</span></div></div></div></footer>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$d ? _sfc_setup$d(props2, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-6492d0c3"]]);
const _sfc_main$c = {
  __name: "Cart",
  __ssrInlineRender: true,
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    cart: {
      type: Array,
      default: () => []
    },
    savedForLater: {
      type: Array,
      default: () => []
    },
    recentlyViewed: {
      type: Array,
      default: () => []
    }
  },
  emits: ["close", "navigate", "updateCart", "removeFromCart", "moveToSavedForLater", "moveToCart", "addToCart", "proceedToCheckout"],
  setup(__props) {
    const activeCartTab = ref("Warenkorb");
    const cartItemCount = computed(() => {
      return props.cart.reduce((count, item) => count + item.quantity, 0);
    });
    const cartTotal = computed(() => {
      return props.cart.reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0);
    });
    const shippingCost = computed(() => {
      return cartTotal.value >= 50 ? 0 : 4.99;
    });
    const remainingForFreeShipping = computed(() => {
      return Math.max(0, 50 - cartTotal.value);
    });
    const freeShippingProgress = computed(() => {
      return Math.min(100, cartTotal.value / 50 * 100);
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black/50 z-50" }, _attrs))} data-v-da58be51><div class="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl" data-v-da58be51><div class="p-6" data-v-da58be51><div class="flex justify-between items-center mb-6" data-v-da58be51><h2 class="text-xl font-bold" data-v-da58be51>Warenkorb (${ssrInterpolate(cartItemCount.value)})</h2><button class="text-gray-500 hover:text-gray-700" data-v-da58be51><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-da58be51><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-da58be51></path></svg></button></div><div class="flex border-b mb-4" data-v-da58be51><button class="${ssrRenderClass([activeCartTab.value === "Warenkorb" ? "border-[#D8127D] text-[#D8127D]" : "border-transparent", "px-4 py-2 border-b-2"])}" data-v-da58be51> Warenkorb </button></div>`);
        if (activeCartTab.value === "Warenkorb" && __props.cart.length > 0) {
          _push(`<div class="space-y-4" data-v-da58be51><!--[-->`);
          ssrRenderList(__props.cart, (item, index2) => {
            _push(`<div class="flex gap-4 pb-4 border-b" data-v-da58be51><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="w-20 h-20 object-cover rounded" data-v-da58be51><div class="flex-1" data-v-da58be51><h3 class="font-semibold" data-v-da58be51>${ssrInterpolate(item.name)}</h3>`);
            if (item.selectedColor || item.selectedSize) {
              _push(`<p class="text-sm text-gray-500" data-v-da58be51>`);
              if (item.selectedColor) {
                _push(`<span data-v-da58be51>Farbe: <span class="capitalize" data-v-da58be51>${ssrInterpolate(item.selectedColor)}</span></span>`);
              } else {
                _push(`<!---->`);
              }
              if (item.selectedColor && item.selectedSize) {
                _push(`<span data-v-da58be51> / </span>`);
              } else {
                _push(`<!---->`);
              }
              if (item.selectedSize) {
                _push(`<span data-v-da58be51>Größe: ${ssrInterpolate(item.selectedSize)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="flex justify-between items-center mt-2" data-v-da58be51><div class="flex items-center border rounded-lg px-2 py-1" data-v-da58be51><button class="p-1 text-gray-600 hover:text-gray-900" data-v-da58be51>-</button><input type="number"${ssrRenderAttr("value", item.quantity)} min="1" class="w-10 text-center text-sm border-x mx-2 focus:outline-none focus:ring-0" data-v-da58be51><button class="p-1 text-gray-600 hover:text-gray-900" data-v-da58be51>+</button></div><div class="font-bold" data-v-da58be51>${ssrInterpolate((parseFloat(item.price) * item.quantity).toFixed(2))} € </div></div><div class="flex justify-end text-sm mt-2" data-v-da58be51><button class="text-gray-500 hover:text-gray-700 mr-4" data-v-da58be51>Bearbeiten</button><button class="text-gray-500 hover:text-gray-700 mr-4" data-v-da58be51>Kopieren</button><button class="text-gray-500 hover:text-gray-700" data-v-da58be51>Löschen</button></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeCartTab.value === "Gespeichert" && __props.savedForLater.length > 0) {
          _push(`<div class="space-y-4" data-v-da58be51><!--[-->`);
          ssrRenderList(__props.savedForLater, (item, index2) => {
            _push(`<div class="flex gap-4 pb-4 border-b" data-v-da58be51><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="w-20 h-20 object-cover rounded" data-v-da58be51><div class="flex-1" data-v-da58be51><h3 class="font-semibold" data-v-da58be51>${ssrInterpolate(item.name)}</h3><p class="text-sm text-gray-500" data-v-da58be51>${ssrInterpolate(item.selectedSize)} / ${ssrInterpolate(item.selectedColor)}</p><div class="flex justify-between items-center mt-2" data-v-da58be51><div class="text-[#D8127D] font-bold" data-v-da58be51>${ssrInterpolate(item.price)} € </div><button class="text-[#D8127D] hover:text-[#b30f68]" data-v-da58be51> In den Warenkorb </button></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeCartTab.value === "Kürzlich angesehen") {
          _push(`<div class="space-y-4" data-v-da58be51><!--[-->`);
          ssrRenderList(__props.recentlyViewed, (item) => {
            _push(`<div class="flex gap-4 pb-4 border-b" data-v-da58be51><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="w-20 h-20 object-cover rounded" data-v-da58be51><div class="flex-1" data-v-da58be51><h3 class="font-semibold" data-v-da58be51>${ssrInterpolate(item.name)}</h3><p class="text-[#D8127D] font-bold" data-v-da58be51>${ssrInterpolate(item.price)} €</p><button class="text-[#D8127D] hover:text-[#b30f68]" data-v-da58be51> In den Warenkorb </button></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeCartTab.value === "Warenkorb" && __props.cart.length === 0) {
          _push(`<div class="text-center py-8" data-v-da58be51><svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-da58be51><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-da58be51></path></svg><p class="text-gray-500" data-v-da58be51>Ihr Warenkorb ist leer</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeCartTab.value === "Warenkorb" && __props.cart.length > 0) {
          _push(`<div class="mt-6 pt-4 border-t" data-v-da58be51><div class="flex justify-between text-gray-700 mb-2" data-v-da58be51><span data-v-da58be51>Zwischensumme</span><span data-v-da58be51>${ssrInterpolate(cartTotal.value.toFixed(2))} €</span></div><div class="flex justify-between text-gray-700 mb-2" data-v-da58be51><span data-v-da58be51>Versandkosten</span><span data-v-da58be51>${ssrInterpolate(shippingCost.value.toFixed(2))} €</span></div><div class="mb-4 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-800" data-v-da58be51>`);
          if (remainingForFreeShipping.value > 0) {
            _push(`<!--[--><p class="mb-2" data-v-da58be51>Noch <strong data-v-da58be51>${ssrInterpolate(remainingForFreeShipping.value.toFixed(2))} €</strong> bis zum <span class="font-semibold" data-v-da58be51>kostenlosen Versand!</span></p><div class="w-full bg-gray-200 rounded-full h-2.5" data-v-da58be51><div class="bg-[#D8127D] h-2.5 rounded-full" style="${ssrRenderStyle({ width: freeShippingProgress.value + "%" })}" data-v-da58be51></div></div><!--]-->`);
          } else {
            _push(`<p class="font-semibold" data-v-da58be51>Kostenloser Versand! 🎉</p>`);
          }
          _push(`</div><div class="flex justify-between font-bold text-lg mb-4" data-v-da58be51><span data-v-da58be51>Gesamtsumme</span><span data-v-da58be51>${ssrInterpolate((cartTotal.value + shippingCost.value).toFixed(2))} €</span></div><button class="btn bg-[#D8127D] text-white w-full mb-3" data-v-da58be51>Zur Kasse</button><button class="btn bg-gray-200 text-gray-800 w-full" data-v-da58be51>Weiter einkaufen</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Cart.vue");
  return _sfc_setup$c ? _sfc_setup$c(props2, ctx) : void 0;
};
const Cart = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-da58be51"]]);
const _sfc_main$b = {
  __name: "Creator",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Creator-Programm – private-shirt.de",
      meta: [
        { name: "description", content: "Verdiene Geld mit deinen Designs. Unser Creator-Programm für Künstler, Designer und Influencer." }
      ]
    });
    ref(null);
    ref(null);
    const form = ref({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      description: "",
      portfolio: "",
      terms: false
    });
    const isSubmitting = ref(false);
    const openFAQ = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-1ff4d3f7><section class="bg-gradient-to-br from-[#D8127D] to-[#b30f68] text-white py-20" data-v-1ff4d3f7><div class="container mx-auto px-6 text-center" data-v-1ff4d3f7><h1 class="text-5xl font-extrabold mb-6" data-v-1ff4d3f7>Gestalte. Teile. Verdiene.</h1><p class="text-xl mb-8 max-w-3xl mx-auto" data-v-1ff4d3f7>Werde Teil unserer Creator-Community! Lade deine Designs hoch, verkaufe sie auf unseren Produkten und verdiene mit jeder Bestellung Geld – ganz ohne Risiko.</p><div class="flex flex-col sm:flex-row gap-4 justify-center" data-v-1ff4d3f7><button class="btn bg-white text-[#D8127D] hover:bg-gray-100 btn-lg" data-v-1ff4d3f7>Jetzt kostenlos starten</button><button class="btn border-2 border-white text-white hover:bg-white hover:text-[#D8127D] btn-lg" data-v-1ff4d3f7>So funktioniert&#39;s</button></div></div></section><section class="py-16 bg-white" data-v-1ff4d3f7><div class="container mx-auto px-6" data-v-1ff4d3f7><h2 class="text-3xl font-bold text-center mb-12" data-v-1ff4d3f7>So funktioniert unser Creator-Programm</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-v-1ff4d3f7><div class="text-center p-6" data-v-1ff4d3f7><div class="w-16 h-16 bg-[#D8127D] rounded-full flex items-center justify-center mx-auto mb-4" data-v-1ff4d3f7><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1ff4d3f7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" data-v-1ff4d3f7></path></svg></div><h3 class="text-xl font-semibold mb-3" data-v-1ff4d3f7>1. Design hochladen</h3><p class="text-gray-600" data-v-1ff4d3f7>Lade deine Designs, Grafiken oder Texte hoch. Wir prüfen sie und stellen sie in unserem Shop zur Verfügung.</p></div><div class="text-center p-6" data-v-1ff4d3f7><div class="w-16 h-16 bg-[#D8127D] rounded-full flex items-center justify-center mx-auto mb-4" data-v-1ff4d3f7><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1ff4d3f7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" data-v-1ff4d3f7></path></svg></div><h3 class="text-xl font-semibold mb-3" data-v-1ff4d3f7>2. Kunden kaufen</h3><p class="text-gray-600" data-v-1ff4d3f7>Kunden entdecken deine Designs und bestellen sie auf T-Shirts, Hoodies, Tassen und mehr.</p></div><div class="text-center p-6" data-v-1ff4d3f7><div class="w-16 h-16 bg-[#D8127D] rounded-full flex items-center justify-center mx-auto mb-4" data-v-1ff4d3f7><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1ff4d3f7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" data-v-1ff4d3f7></path></svg></div><h3 class="text-xl font-semibold mb-3" data-v-1ff4d3f7>3. Geld verdienen</h3><p class="text-gray-600" data-v-1ff4d3f7>Du erhältst eine Provision für jede Bestellung mit deinem Design. Monatliche Auszahlungen, keine Mindestbeträge.</p></div></div></div></section><section class="py-16 bg-gray-50" data-v-1ff4d3f7><div class="container mx-auto px-6" data-v-1ff4d3f7><h2 class="text-3xl font-bold text-center mb-12" data-v-1ff4d3f7>Warum Creator bei uns werden?</h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-v-1ff4d3f7><div class="bg-white p-6 rounded-lg shadow-sm" data-v-1ff4d3f7><div class="text-3xl font-bold text-[#D8127D] mb-2" data-v-1ff4d3f7>15%</div><h3 class="font-semibold mb-2" data-v-1ff4d3f7>Provision</h3><p class="text-sm text-gray-600" data-v-1ff4d3f7>Du erhältst 15% vom Verkaufspreis für jedes verkaufte Produkt mit deinem Design.</p></div><div class="bg-white p-6 rounded-lg shadow-sm" data-v-1ff4d3f7><div class="text-3xl font-bold text-[#D8127D] mb-2" data-v-1ff4d3f7>0€</div><h3 class="font-semibold mb-2" data-v-1ff4d3f7>Keine Kosten</h3><p class="text-sm text-gray-600" data-v-1ff4d3f7>Komplett kostenlos. Keine Anmeldegebühren, keine monatlichen Kosten.</p></div><div class="bg-white p-6 rounded-lg shadow-sm" data-v-1ff4d3f7><div class="text-3xl font-bold text-[#D8127D] mb-2" data-v-1ff4d3f7>24h</div><h3 class="font-semibold mb-2" data-v-1ff4d3f7>Schnelle Prüfung</h3><p class="text-sm text-gray-600" data-v-1ff4d3f7>Deine Designs werden innerhalb von 24 Stunden geprüft und freigeschaltet.</p></div><div class="bg-white p-6 rounded-lg shadow-sm" data-v-1ff4d3f7><div class="text-3xl font-bold text-[#D8127D] mb-2" data-v-1ff4d3f7>∞</div><h3 class="font-semibold mb-2" data-v-1ff4d3f7>Unbegrenzt</h3><p class="text-sm text-gray-600" data-v-1ff4d3f7>Lade so viele Designs hoch wie du möchtest. Keine Limits.</p></div></div></div></section><section class="py-16 bg-white" data-v-1ff4d3f7><div class="container mx-auto px-6" data-v-1ff4d3f7><h2 class="text-3xl font-bold text-center mb-12" data-v-1ff4d3f7>Erfolgsgeschichten</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-8" data-v-1ff4d3f7><div class="bg-gray-50 p-6 rounded-lg" data-v-1ff4d3f7><div class="flex items-center mb-4" data-v-1ff4d3f7><div class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center text-white font-bold mr-4" data-v-1ff4d3f7> AS </div><div data-v-1ff4d3f7><h4 class="font-semibold" data-v-1ff4d3f7>Anna Schmidt</h4><p class="text-sm text-gray-600" data-v-1ff4d3f7>Illustratorin</p></div></div><p class="text-gray-700 italic" data-v-1ff4d3f7>&quot;Seit ich bei private-shirt.de Creator bin, verdiene ich monatlich 200-300€ zusätzlich. Meine Tierillustrationen sind besonders beliebt!&quot;</p></div><div class="bg-gray-50 p-6 rounded-lg" data-v-1ff4d3f7><div class="flex items-center mb-4" data-v-1ff4d3f7><div class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center text-white font-bold mr-4" data-v-1ff4d3f7> MJ </div><div data-v-1ff4d3f7><h4 class="font-semibold" data-v-1ff4d3f7>Max Johnson</h4><p class="text-sm text-gray-600" data-v-1ff4d3f7>Grafikdesigner</p></div></div><p class="text-gray-700 italic" data-v-1ff4d3f7>&quot;Perfekt für passives Einkommen! Meine minimalistischen Designs verkaufen sich super. Die Auszahlungen kommen pünktlich.&quot;</p></div></div></div></section><section class="py-16 bg-gradient-to-br from-gray-50 to-white" data-v-1ff4d3f7><div class="container mx-auto px-6" data-v-1ff4d3f7><div class="max-w-2xl mx-auto" data-v-1ff4d3f7><h2 class="text-3xl font-bold text-center mb-8" data-v-1ff4d3f7>Jetzt Creator werden</h2><form class="bg-white p-8 rounded-lg shadow-lg" data-v-1ff4d3f7><div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" data-v-1ff4d3f7><div data-v-1ff4d3f7><label class="block text-sm font-medium text-gray-700 mb-2" data-v-1ff4d3f7>Vorname *</label><input${ssrRenderAttr("value", form.value.firstName)} type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent" data-v-1ff4d3f7></div><div data-v-1ff4d3f7><label class="block text-sm font-medium text-gray-700 mb-2" data-v-1ff4d3f7>Nachname *</label><input${ssrRenderAttr("value", form.value.lastName)} type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent" data-v-1ff4d3f7></div></div><div class="mb-6" data-v-1ff4d3f7><label class="block text-sm font-medium text-gray-700 mb-2" data-v-1ff4d3f7>E-Mail *</label><input${ssrRenderAttr("value", form.value.email)} type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent" data-v-1ff4d3f7></div><div class="mb-6" data-v-1ff4d3f7><label class="block text-sm font-medium text-gray-700 mb-2" data-v-1ff4d3f7>Telefon</label><input${ssrRenderAttr("value", form.value.phone)} type="tel" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent" data-v-1ff4d3f7></div><div class="mb-6" data-v-1ff4d3f7><label class="block text-sm font-medium text-gray-700 mb-2" data-v-1ff4d3f7>Kurze Beschreibung deiner Designs</label><textarea rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent" placeholder="z.B. Minimalistische Illustrationen, Vintage-Logos, Tierzeichnungen..." data-v-1ff4d3f7>${ssrInterpolate(form.value.description)}</textarea></div><div class="mb-6" data-v-1ff4d3f7><label class="block text-sm font-medium text-gray-700 mb-2" data-v-1ff4d3f7>Portfolio/Links (optional)</label><input${ssrRenderAttr("value", form.value.portfolio)} type="url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent" placeholder="https://behance.net/username oder Instagram-Link" data-v-1ff4d3f7></div><div class="mb-6" data-v-1ff4d3f7><label class="flex items-start" data-v-1ff4d3f7><input${ssrIncludeBooleanAttr(Array.isArray(form.value.terms) ? ssrLooseContain(form.value.terms, null) : form.value.terms) ? " checked" : ""} type="checkbox" required class="mt-1 mr-3" data-v-1ff4d3f7><span class="text-sm text-gray-600" data-v-1ff4d3f7>Ich akzeptiere die <a href="#" class="text-[#D8127D] hover:underline" data-v-1ff4d3f7>AGB</a> und <a href="#" class="text-[#D8127D] hover:underline" data-v-1ff4d3f7>Datenschutzerklärung</a> *</span></label></div><button type="submit"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="w-full btn bg-[#D8127D] hover:bg-[#b30f68] text-white btn-lg" data-v-1ff4d3f7>${ssrInterpolate(isSubmitting.value ? "Wird gesendet..." : "Jetzt kostenlos anmelden")}</button></form></div></div></section><section class="py-16 bg-white" data-v-1ff4d3f7><div class="container mx-auto px-6" data-v-1ff4d3f7><h2 class="text-3xl font-bold text-center mb-12" data-v-1ff4d3f7>Häufige Fragen</h2><div class="max-w-3xl mx-auto space-y-6" data-v-1ff4d3f7><div class="border border-gray-200 rounded-lg" data-v-1ff4d3f7><button class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50" data-v-1ff4d3f7><span class="font-semibold" data-v-1ff4d3f7>Wie hoch ist die Provision?</span><svg class="${ssrRenderClass([{ "rotate-180": openFAQ.value === 0 }, "w-5 h-5 transform transition-transform"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1ff4d3f7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-1ff4d3f7></path></svg></button>`);
      if (openFAQ.value === 0) {
        _push(`<div class="px-6 pb-4 text-gray-600" data-v-1ff4d3f7> Du erhältst 15% vom Verkaufspreis für jedes verkaufte Produkt mit deinem Design. Bei einem 20€ T-Shirt wären das 3€ Provision. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="border border-gray-200 rounded-lg" data-v-1ff4d3f7><button class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50" data-v-1ff4d3f7><span class="font-semibold" data-v-1ff4d3f7>Wann werde ich ausgezahlt?</span><svg class="${ssrRenderClass([{ "rotate-180": openFAQ.value === 1 }, "w-5 h-5 transform transition-transform"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1ff4d3f7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-1ff4d3f7></path></svg></button>`);
      if (openFAQ.value === 1) {
        _push(`<div class="px-6 pb-4 text-gray-600" data-v-1ff4d3f7> Auszahlungen erfolgen monatlich per Überweisung. Es gibt keine Mindestbeträge - auch kleine Beträge werden ausgezahlt. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="border border-gray-200 rounded-lg" data-v-1ff4d3f7><button class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50" data-v-1ff4d3f7><span class="font-semibold" data-v-1ff4d3f7>Welche Dateiformate werden akzeptiert?</span><svg class="${ssrRenderClass([{ "rotate-180": openFAQ.value === 2 }, "w-5 h-5 transform transition-transform"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1ff4d3f7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-1ff4d3f7></path></svg></button>`);
      if (openFAQ.value === 2) {
        _push(`<div class="px-6 pb-4 text-gray-600" data-v-1ff4d3f7> Wir akzeptieren PNG, JPG, SVG und PDF. Für beste Druckqualität empfehlen wir Vektordateien (SVG, PDF) oder hochauflösende Rasterbilder (mindestens 300 DPI). </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="border border-gray-200 rounded-lg" data-v-1ff4d3f7><button class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50" data-v-1ff4d3f7><span class="font-semibold" data-v-1ff4d3f7>Kann ich meine Designs später ändern?</span><svg class="${ssrRenderClass([{ "rotate-180": openFAQ.value === 3 }, "w-5 h-5 transform transition-transform"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1ff4d3f7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-1ff4d3f7></path></svg></button>`);
      if (openFAQ.value === 3) {
        _push(`<div class="px-6 pb-4 text-gray-600" data-v-1ff4d3f7> Ja, du kannst deine Designs jederzeit aktualisieren oder entfernen. Änderungen werden innerhalb von 24 Stunden im Shop sichtbar. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></section></div>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Creator.vue");
  return _sfc_setup$b ? _sfc_setup$b(props2, ctx) : void 0;
};
const Creator = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-1ff4d3f7"]]);
const _imports_0$1 = "" + __buildAssetsURL("Video_PSM.Dq6tla64.mp4");
const _imports_1$1 = "" + __buildAssetsURL("20210421_001_Private_Shirt_Hamburg.B2S9bdWR.webp");
const _imports_2 = "" + __buildAssetsURL("20201123_193242.CRFIwVki.webp");
const _sfc_main$a = {
  __name: "index",
  __ssrInlineRender: true,
  props: {
    readyToBuyProducts: {
      type: Array,
      default: () => []
    }
  },
  emits: ["navigate", "selectProduct"],
  setup(__props) {
    const props2 = __props;
    const productsPerSlide = ref(3);
    const currentBestsellerPage = ref(0);
    const currentSummerPage = ref(0);
    const currentTopCustomersPage = ref(0);
    const currentReviewsPage = ref(0);
    const bestsellerProducts = computed(() => props2.readyToBuyProducts.filter((p) => p.tags.includes("bestseller")));
    const summerProducts = computed(() => props2.readyToBuyProducts.filter((p) => p.tags.includes("summer")));
    const paginatedBestsellers = computed(() => {
      const start = currentBestsellerPage.value * productsPerSlide.value;
      const end = start + productsPerSlide.value;
      return bestsellerProducts.value.slice(start, end);
    });
    const paginatedSummerProducts = computed(() => {
      const start = currentSummerPage.value * productsPerSlide.value;
      const end = start + productsPerSlide.value;
      return summerProducts.value.slice(start, end);
    });
    computed(() => {
      const start = currentTopCustomersPage.value * 4;
      const end = start + 4;
      return topCustomers.value.slice(start, end);
    });
    const visibleReviews = computed(() => {
      const start = currentReviewsPage.value * 3;
      const end = start + 3;
      return featuredReviews.value.slice(start, end);
    });
    const features = ref([
      { title: "Premiumdruck ab 1 Stück", description: "Keine Mindestbestellmenge. Perfekt für Einzelstücke und Geschenke.", icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>' },
      { title: "Nachhaltige Textilien", description: "Wir setzen auf Bio-Baumwolle und umweltfreundliche Materialien.", icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343m11.314 11.314a8 8 0 00-11.314-11.314"/>' },
      { title: "Versand in 2–4 Tagen", description: "Schnelle Produktion und Lieferung mit unseren zuverlässigen Partnern.", icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>' },
      { title: "Made in Germany", description: "Druck und Veredelung finden direkt bei uns in Deutschland statt.", icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M4 17v4M2 19h4M17 3v4M15 5h4M16 17v4M14 19h4"/>' }
    ]);
    const topCustomers = ref([
      { id: 1, name: "Hamburg Startups", logo: "https://www.peopleplan.eu/wp-content/uploads/sites/6/2023/01/Hochbahn-2.png" },
      { id: 2, name: "Event Masters", logo: "https://app.tradersclub24.de/wp-content/uploads/2023/09/Hapag_lloyd_logo.png" },
      { id: 3, name: "TechCorp GmbH", logo: "https://espressohouse.zendesk.com/hc/theming_assets/01HZPM9NQSV96Y55Z1PZM2S2Y6" },
      { id: 4, name: "Creative Agency", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiVzAKXb_clXNwslAGqeZfH_dHmFyYZeUg7A&s" },
      { id: 5, name: "Sports Club", logo: "https://espressohouse.zendesk.com/hc/theming_assets/01HZPM9NQSV96Y55Z1PZM2S2Y6" },
      { id: 6, name: "University Hamburg", logo: "https://espressohouse.zendesk.com/hc/theming_assets/01HZPM9NQSV96Y55Z1PZM2S2Y6" }
    ]);
    const featuredReviews = ref([
      {
        id: 1,
        author: "Jörg Baumann",
        authorInitials: "JB",
        date: "Juli 2025",
        text: "Absolut begeistert von der Qualität und dem schnellen Versand! Mein Team-Hoodie sieht fantastisch aus. Jederzeit wieder!"
      },
      {
        id: 2,
        author: "Christian Ippendorf",
        authorInitials: "CI",
        date: "Juni 2023",
        text: "Super freundliches Personal, man nimmt sich Zeit für den Kunden und wenn die passende Größe nicht da ist, ruft man in der anderen Filiale an und fragt nach ob sie dort vorrätig ist. Ich kann es nur empfehlen und es ging auch fix, man konnte das T Shirt direkt am nächsten holen. Nochmal vielen Dank."
      },
      {
        id: 3,
        author: "Helmut Burger",
        authorInitials: "HB",
        date: "Juni 2025",
        text: "Beim Shoppen sind wir am Geschäft vorbeigekommen und haben uns spontan überlegt für einen besonderen Anlass kurzfristig Shirts mit eigenem Aufdruck bedrucken zu lassen."
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-80fdfae7><section class="relative h-[50vh] flex" data-v-80fdfae7><div class="w-1/2 bg-white flex items-center justify-center p-8" data-v-80fdfae7><div class="max-w-xl" data-v-80fdfae7><h1 class="text-5xl md:text-5xl font-extrabold leading-tight tracking-tight mb-3" style="${ssrRenderStyle({ "font-size": "5rem" })}" data-v-80fdfae7><span class="text-[#D8127D]" data-v-80fdfae7>Sei du selbst. sei einzigartig.</span> <span class="text-[#D8127D]" data-v-80fdfae7></span> <span class="text-[#0a3a47]" data-v-80fdfae7></span></h1><p class="text-base md:text-xl font-light mb-6 text-[#0a3a47]" data-v-80fdfae7>gestalte ganz frei deinen look. t-shirts, sweatshirts, hoodies und vieles mehr. probier’s einfach!</p><div class="flex flex-col sm:flex-row gap-4" data-v-80fdfae7><button class="btn bg-[#ffd44d] hover:bg-[#ffe28a] text-[#0a3a47] border-2 border-[#ffd44d]" data-v-80fdfae7>Jetzt gestalten</button><button class="btn border-2 border-[#D8127D] text-[#D8127D] hover:bg-[#D8127D] hover:text-white" data-v-80fdfae7>Großbestellung anfragen</button></div></div></div><div class="w-1/2 relative overflow-hidden" data-v-80fdfae7><div class="absolute inset-0 bg-black/20 z-10" data-v-80fdfae7></div><video class="absolute inset-0 w-full h-full object-cover" autoplay loop muted playsinline data-v-80fdfae7><source${ssrRenderAttr("src", _imports_0$1)} type="video/mp4" data-v-80fdfae7></video></div></section><section class="py-12 bg-white" data-v-80fdfae7><div class="container mx-auto px-6" data-v-80fdfae7><div class="flex items-baseline justify-between mb-8" data-v-80fdfae7><h2 class="text-3xl font-bold" data-v-80fdfae7>Hot on Socials</h2><button class="text-sm text-gray-600 hover:text-[#D8127D]" data-v-80fdfae7>Alle anzeigen</button></div><div class="relative" data-v-80fdfae7><div class="overflow-visible" data-v-80fdfae7><div${ssrRenderAttrs({
        name: "slide",
        class: "flex gap-6"
      })} data-v-80fdfae7>`);
      ssrRenderList(paginatedBestsellers.value, (product) => {
        _push(`<div class="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden group flex-shrink-0" style="${ssrRenderStyle({ width: `${100 / productsPerSlide.value}%` })}" data-v-80fdfae7><div class="relative h-72" data-v-80fdfae7><img${ssrRenderAttr("src", product.image)}${ssrRenderAttr("alt", product.name)} class="w-full h-full object-cover" data-v-80fdfae7><div class="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" data-v-80fdfae7><button class="btn bg-white text-gray-900 shadow" data-v-80fdfae7>Details anzeigen</button></div></div><div class="p-4" data-v-80fdfae7><h4 class="font-semibold truncate" data-v-80fdfae7>${ssrInterpolate(product.name)}</h4>`);
        if (product.category || product.categoryLabel) {
          _push(`<p class="text-gray-500 text-sm truncate" data-v-80fdfae7>${ssrInterpolate(product.categoryLabel || product.category)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="text-[#D8127D] font-bold" data-v-80fdfae7>${ssrInterpolate(product.price)} €</p></div></div>`);
      });
      _push(`</div></div>`);
      if (currentBestsellerPage.value > 0) {
        _push(`<button class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10" data-v-80fdfae7><svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80fdfae7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-80fdfae7></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      if ((currentBestsellerPage.value + 1) * productsPerSlide.value < bestsellerProducts.value.length) {
        _push(`<button class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10" data-v-80fdfae7><svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80fdfae7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-80fdfae7></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section><section class="py-12" data-v-80fdfae7><div class="container mx-auto px-6" data-v-80fdfae7><div class="flex items-baseline justify-between mb-8" data-v-80fdfae7><h2 class="text-3xl font-bold" data-v-80fdfae7>Bestseller für Dich</h2><button class="text-sm text-gray-600 hover:text-[#D8127D]" data-v-80fdfae7>Alle anzeigen</button></div><div class="relative" data-v-80fdfae7><div class="overflow-visible" data-v-80fdfae7><div${ssrRenderAttrs({
        name: "slide",
        class: "flex gap-6"
      })} data-v-80fdfae7>`);
      ssrRenderList(paginatedSummerProducts.value, (product) => {
        _push(`<div class="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden group flex-shrink-0" style="${ssrRenderStyle({ width: `${100 / productsPerSlide.value}%` })}" data-v-80fdfae7><div class="relative h-72" data-v-80fdfae7><img${ssrRenderAttr("src", product.image)}${ssrRenderAttr("alt", product.name)} class="w-full h-full object-cover" data-v-80fdfae7><div class="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" data-v-80fdfae7><button class="btn bg-white text-gray-900 shadow" data-v-80fdfae7>Details anzeigen</button></div></div><div class="p-4" data-v-80fdfae7><h4 class="font-semibold truncate" data-v-80fdfae7>${ssrInterpolate(product.name)}</h4>`);
        if (product.category || product.categoryLabel) {
          _push(`<p class="text-gray-500 text-sm truncate" data-v-80fdfae7>${ssrInterpolate(product.categoryLabel || product.category)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="text-[#D8127D] font-bold" data-v-80fdfae7>${ssrInterpolate(product.price)} €</p></div></div>`);
      });
      _push(`</div></div>`);
      if (currentSummerPage.value > 0) {
        _push(`<button class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10" data-v-80fdfae7><svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80fdfae7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-80fdfae7></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      if ((currentSummerPage.value + 1) * productsPerSlide.value < summerProducts.value.length) {
        _push(`<button class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10" data-v-80fdfae7><svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80fdfae7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-80fdfae7></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section><section class="py-16 sm:py-24 bg-gray-100" data-v-80fdfae7><div class="container mx-auto px-6" data-v-80fdfae7><div class="flex flex-col md:flex-row items-center gap-12" data-v-80fdfae7><div class="md:w-1/2 order-2 md:order-1 text-center md:text-left" data-v-80fdfae7><h2 class="text-3xl font-bold mb-4" data-v-80fdfae7>Dein professioneller Auftritt: Firmenkleidung</h2><p class="text-lg text-gray-600 mb-6" data-v-80fdfae7> Statte dein Team mit hochwertiger, individuell bedruckter Firmenkleidung aus. Ob T-Shirts, Polos oder Jacken – wir sorgen für einen einheitlichen und professionellen Look. </p><button class="btn btn-primary btn-lg" data-v-80fdfae7>Jetzt anfragen</button></div><div class="md:w-1/2 order-1 md:order-2" data-v-80fdfae7><img src="https://images.unsplash.com/photo-1637225999234-eb7da046cb4b?q=80&amp;w=2340&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Team in custom corporate t-shirts" class="rounded-lg shadow-lg w-full h-auto object-cover" data-v-80fdfae7></div></div></div></section><section class="py-16 sm:py-24" data-v-80fdfae7><div class="container mx-auto px-6" data-v-80fdfae7><h2 class="text-3xl font-bold text-center mb-12" data-v-80fdfae7>Warum private-shirt.de?</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" data-v-80fdfae7><!--[-->`);
      ssrRenderList(features.value, (feature) => {
        _push(`<div class="text-center p-6" data-v-80fdfae7><div class="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4" data-v-80fdfae7><svg class="h-8 w-8 feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-80fdfae7>${feature.icon ?? ""}</svg></div><h3 class="text-xl font-semibold mb-2" data-v-80fdfae7>${ssrInterpolate(feature.title)}</h3><p class="text-gray-600" data-v-80fdfae7>${ssrInterpolate(feature.description)}</p></div>`);
      });
      _push(`<!--]--></div></div></section><section class="py-16 sm:py-24 bg-white" data-v-80fdfae7><div class="container mx-auto px-6" data-v-80fdfae7><div class="flex flex-col md:flex-row items-center gap-12" data-v-80fdfae7><div class="md:w-1/2" data-v-80fdfae7><img src="https://images.unsplash.com/photo-1597374399280-541892788610?q=80&amp;w=2340&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Person creating a custom design" class="rounded-lg shadow-lg w-full h-auto object-cover" data-v-80fdfae7></div><div class="md:w-1/2 text-center md:text-left" data-v-80fdfae7><h2 class="text-3xl font-bold mb-4" data-v-80fdfae7>Gestalte deine eigene Kleidung</h2><p class="text-lg text-gray-600 mb-6" data-v-80fdfae7> Lass deiner Kreativität freien Lauf! Mit unserem einfachen Online-Creator kannst du T-Shirts, Hoodies, Tassen und mehr mit deinen eigenen Designs, Texten und Bildern gestalten. </p><button class="btn btn-primary btn-lg" data-v-80fdfae7>Jetzt gestalten</button></div></div></div></section><section class="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-white" data-v-80fdfae7><div class="container mx-auto px-6" data-v-80fdfae7><div class="text-center mb-16" data-v-80fdfae7><h2 class="text-4xl font-bold text-gray-900 mb-4" data-v-80fdfae7>Unsere Kunden vertrauen uns</h2><div class="flex justify-center items-center gap-4 mb-6" data-v-80fdfae7><div class="flex text-yellow-400 text-3xl" data-v-80fdfae7><span data-v-80fdfae7>★★★★☆</span></div><div class="text-left" data-v-80fdfae7><div class="text-2xl font-bold text-gray-900" data-v-80fdfae7>4.7/5</div><div class="text-sm text-gray-600" data-v-80fdfae7>Google Bewertungen</div></div></div></div><div class="mb-16" data-v-80fdfae7><h3 class="text-2xl font-bold text-center mb-8" data-v-80fdfae7>Was unsere Kunden sagen</h3><div class="relative" data-v-80fdfae7><div class="overflow-hidden" data-v-80fdfae7><div${ssrRenderAttrs({
        name: "slide",
        class: "flex"
      })} data-v-80fdfae7>`);
      ssrRenderList(visibleReviews.value, (review) => {
        _push(`<div class="flex-shrink-0" style="${ssrRenderStyle({ width: `${100 / 3}%`, padding: "0 0.75rem" })}" data-v-80fdfae7><div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full" data-v-80fdfae7><div class="flex items-center mb-4" data-v-80fdfae7><div class="w-12 h-12 bg-gradient-to-br from-[#D8127D] to-[#b30f68] rounded-full flex items-center justify-center text-white font-bold mr-4" data-v-80fdfae7>${ssrInterpolate(review.authorInitials)}</div><div data-v-80fdfae7><h4 class="font-semibold text-gray-900" data-v-80fdfae7>${ssrInterpolate(review.author)}</h4><div class="flex items-center" data-v-80fdfae7><span class="text-yellow-400 text-sm mr-2" data-v-80fdfae7>★★★★★</span><span class="text-sm text-gray-600" data-v-80fdfae7>${ssrInterpolate(review.date)}</span></div></div></div><p class="text-gray-700 leading-relaxed" data-v-80fdfae7>&quot;${ssrInterpolate(review.text)}&quot;</p></div></div>`);
      });
      _push(`</div></div>`);
      if (currentReviewsPage.value > 0) {
        _push(`<button class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10" data-v-80fdfae7><svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80fdfae7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-80fdfae7></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      if ((currentReviewsPage.value + 1) * 3 < featuredReviews.value.length) {
        _push(`<button class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10" data-v-80fdfae7><svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-80fdfae7><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-80fdfae7></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex justify-center gap-4" data-v-80fdfae7><a href="https://www.google.com/search?q=private-shirt.de+reviews" target="_blank" rel="noopener" class="btn bg-[#D8127D] text-white hover:bg-[#b30f68]" data-v-80fdfae7> Alle Reviews ansehen </a><a href="https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4" target="_blank" rel="noopener" class="btn border-2 border-[#D8127D] text-[#D8127D] hover:bg-[#D8127D] hover:text-white" data-v-80fdfae7> Review schreiben </a></div></div></section><section class="py-16 sm:py-24 bg-gray-50" data-v-80fdfae7><div class="container mx-auto px-6 text-center" data-v-80fdfae7><div class="mb-8" data-v-80fdfae7><svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="mx-auto text-[#FFC72C]" data-v-80fdfae7><path d="M40 0C21.2 0 6 15.2 6 34C6 58 40 80 40 80C40 80 74 58 74 34C74 15.2 58.8 0 40 0ZM40 46C33.488 46 28 40.512 28 34C28 27.488 33.488 22 40 22C46.512 22 52 27.488 52 34C52 40.512 46.512 46 40 46Z" fill="currentColor" data-v-80fdfae7></path></svg></div><h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12 relative inline-block leading-tight" data-v-80fdfae7> Zuhause, wo du es bist <span class="block absolute -bottom-3 left-0 w-full h-2 bg-[#D8127D] transform skew-x-12 opacity-75" data-v-80fdfae7></span></h2><div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto" data-v-80fdfae7><div class="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-left" data-v-80fdfae7><img${ssrRenderAttr("src", _imports_1$1)} alt="Europa Passage Storefront" class="w-full h-48 object-cover rounded-lg mb-6 shadow-sm" data-v-80fdfae7><h3 class="text-2xl font-bold text-[#D8127D] mb-4" data-v-80fdfae7>Europa Passage</h3><p class="text-lg font-medium text-gray-800 mb-2" data-v-80fdfae7>Private Shirt Europa Passage</p><p class="text-gray-600 mb-4" data-v-80fdfae7><a href="https://maps.google.com/?q=Ballindamm 40, 20095 Hamburg" target="_blank" class="text-[#D8127D] hover:underline" data-v-80fdfae7> Ballindamm 40, 20095 Hamburg </a></p><p class="text-gray-700 mb-2" data-v-80fdfae7><span class="font-semibold" data-v-80fdfae7>Tel:</span> <a href="tel:+494032873804" class="text-[#D8127D] hover:underline" data-v-80fdfae7>040 328 738 04</a></p><p class="text-gray-700 mb-2" data-v-80fdfae7><span class="font-semibold" data-v-80fdfae7>Fax:</span> 040 328 738 15</p><p class="text-gray-700" data-v-80fdfae7><span class="font-semibold" data-v-80fdfae7>E-Mail:</span> <a href="mailto:europa-passage@private-shirt.de" class="text-[#D8127D] hover:underline" data-v-80fdfae7>europa-passage@private-shirt.de</a></p></div><div class="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-left" data-v-80fdfae7><img${ssrRenderAttr("src", _imports_2)} alt="Altona Storefront" class="w-full h-48 object-cover rounded-lg mb-6 shadow-sm" data-v-80fdfae7><h3 class="text-2xl font-bold text-[#D8127D] mb-4" data-v-80fdfae7>Altona</h3><p class="text-lg font-medium text-gray-800 mb-2" data-v-80fdfae7>EKZ Mercado</p><p class="text-lg font-medium text-gray-800 mb-2" data-v-80fdfae7>Private Shirt Altona</p><p class="text-gray-600 mb-4" data-v-80fdfae7><a href="https://maps.google.com/?q=Ottenser Hauptstraße 10, 22765 Hamburg" target="_blank" class="text-[#D8127D] hover:underline" data-v-80fdfae7> Ottenser Hauptstraße 10, 22765 Hamburg </a></p><p class="text-gray-700 mb-2" data-v-80fdfae7><span class="font-semibold" data-v-80fdfae7>Tel:</span> <a href="tel:+494039907778" class="text-[#D8127D] hover:underline" data-v-80fdfae7>040 399 077 78</a></p><p class="text-gray-700 mb-2" data-v-80fdfae7><span class="font-semibold" data-v-80fdfae7>Fax:</span> 040 399 081 16</p><p class="text-gray-700" data-v-80fdfae7><span class="font-semibold" data-v-80fdfae7>E-Mail:</span> <a href="mailto:altona@private-shirt.de" class="text-[#D8127D] hover:underline" data-v-80fdfae7>altona@private-shirt.de</a></p></div></div></div></section></div>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup$a ? _sfc_setup$a(props2, ctx) : void 0;
};
const HomePage = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-80fdfae7"]]);
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HomePage
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = {
  __name: "ready-to-buy",
  __ssrInlineRender: true,
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    readyToBuyProducts: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    totalPages: {
      type: Number,
      default: 1
    }
  },
  emits: ["navigate", "selectProduct", "addToCart"],
  setup(__props, { emit: __emit }) {
    const props2 = __props;
    const emit = __emit;
    const selectedCategory = ref("all");
    const searchQuery = ref("");
    const debouncedSearchQuery = ref("");
    const sortBy = ref("menu_order");
    const currentPageNumber = ref(1);
    const sortOptions = [
      { value: "menu_order", label: "Standard" },
      { value: "popularity", label: "Beliebtheit" },
      { value: "date", label: "Neueste" },
      { value: "price", label: "Preis: Niedrig zu Hoch" },
      { value: "price-desc", label: "Preis: Hoch zu Niedrig" }
    ];
    const filteredReadyToBuyProducts = computed(() => {
      if (selectedCategory.value === "all") return props2.readyToBuyProducts;
      return props2.readyToBuyProducts.filter((product) => product.category === selectedCategory.value);
    });
    watch([debouncedSearchQuery, sortBy, currentPageNumber], () => {
      emit("updateFilters", {
        search: debouncedSearchQuery.value,
        sort: sortBy.value,
        page: currentPageNumber.value,
        category: selectedCategory.value
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-6 py-12" }, _attrs))} data-v-7cdcf6fd><h1 class="text-4xl font-bold mb-2" data-v-7cdcf6fd>Fertige Produkte</h1><p class="text-lg text-gray-600 mb-10" data-v-7cdcf6fd>Entdecke unsere Kollektion an fertigen Produkten.</p><div class="flex space-x-4 mb-8 overflow-x-auto pb-4" data-v-7cdcf6fd><!--[-->`);
      ssrRenderList(__props.categories, (category) => {
        _push(`<button class="${ssrRenderClass([
          "px-4 py-2 rounded-lg whitespace-nowrap",
          selectedCategory.value === category.id ? "bg-[#D8127D] text-white" : "bg-gray-100"
        ])}" data-v-7cdcf6fd>${ssrInterpolate(category.name)}</button>`);
      });
      _push(`<!--]--></div><div class="bg-white border-b mb-8" data-v-7cdcf6fd><div class="container mx-auto px-6 py-4" data-v-7cdcf6fd><div class="flex flex-col md:flex-row gap-4 items-center justify-between" data-v-7cdcf6fd><div class="w-full md:w-96" data-v-7cdcf6fd><div class="relative" data-v-7cdcf6fd><input type="text"${ssrRenderAttr("value", searchQuery.value)} placeholder="Produkte suchen..." class="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-[#D8127D] focus:ring-1 focus:ring-[#D8127D]" data-v-7cdcf6fd><svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-7cdcf6fd><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-7cdcf6fd></path></svg></div></div><div class="w-full md:w-64" data-v-7cdcf6fd><select class="w-full px-4 py-2 border rounded-lg focus:border-[#D8127D] focus:ring-1 focus:ring-[#D8127D]" data-v-7cdcf6fd><!--[-->`);
      ssrRenderList(sortOptions, (option) => {
        _push(`<option${ssrRenderAttr("value", option.value)} data-v-7cdcf6fd${ssrIncludeBooleanAttr(Array.isArray(sortBy.value) ? ssrLooseContain(sortBy.value, option.value) : ssrLooseEqual(sortBy.value, option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`);
      });
      _push(`<!--]--></select></div></div></div></div><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-v-7cdcf6fd>`);
      if (!__props.isLoading) {
        _push(`<!--[-->`);
        ssrRenderList(filteredReadyToBuyProducts.value, (product) => {
          _push(`<div class="bg-white rounded-lg shadow-md overflow-hidden group" data-v-7cdcf6fd><div class="relative" data-v-7cdcf6fd><img${ssrRenderAttr("src", product.image)}${ssrRenderAttr("alt", product.name)} class="w-full h-64 object-cover" data-v-7cdcf6fd><div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" data-v-7cdcf6fd><div class="flex flex-col gap-2" data-v-7cdcf6fd><button class="btn bg-white text-gray-900" data-v-7cdcf6fd> Details anzeigen </button><button class="btn bg-[#D8127D] text-white" data-v-7cdcf6fd> In den Warenkorb </button></div></div></div><div class="p-4" data-v-7cdcf6fd><h4 class="font-semibold" data-v-7cdcf6fd>${ssrInterpolate(product.name)}</h4><p class="text-[#D8127D] font-bold" data-v-7cdcf6fd>${ssrInterpolate(product.price)} €</p></div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(8, (n) => {
          _push(`<div class="bg-white rounded-lg shadow-md overflow-hidden" data-v-7cdcf6fd><div class="animate-pulse" data-v-7cdcf6fd><div class="bg-gray-200 h-64" data-v-7cdcf6fd></div><div class="p-4" data-v-7cdcf6fd><div class="h-4 bg-gray-200 rounded w-3/4 mb-2" data-v-7cdcf6fd></div><div class="h-4 bg-gray-200 rounded w-1/4" data-v-7cdcf6fd></div></div></div></div>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div><div class="flex justify-center space-x-2 mt-8" data-v-7cdcf6fd><!--[-->`);
      ssrRenderList(__props.totalPages, (page) => {
        _push(`<button class="${ssrRenderClass([
          "px-4 py-2 rounded-lg",
          currentPageNumber.value === page ? "bg-[#D8127D] text-white" : "bg-gray-100 hover:bg-gray-200"
        ])}" data-v-7cdcf6fd>${ssrInterpolate(page)}</button>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ready-to-buy.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props2, ctx) : void 0;
};
const ReadyToBuyPage = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-7cdcf6fd"]]);
const readyToBuy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ReadyToBuyPage
}, Symbol.toStringTag, { value: "Module" }));
const useCart = () => {
  const cart = ref([]);
  const savedForLater = ref([]);
  const recentlyViewed = ref([]);
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);
  });
  const cartItemCount = computed(() => {
    return cart.value.reduce((count, item) => count + item.quantity, 0);
  });
  const shippingCost = computed(() => {
    return cartTotal.value >= 50 ? 0 : 4.99;
  });
  const remainingForFreeShipping = computed(() => {
    return Math.max(0, 50 - cartTotal.value);
  });
  const freeShippingProgress = computed(() => {
    return Math.min(100, cartTotal.value / 50 * 100);
  });
  const addToCart = (product) => {
    cart.value.push({
      ...product,
      quantity: product.quantity || 1,
      selectedSize: product.selectedSize || null,
      selectedColor: product.selectedColor || null
    });
    localStorage.setItem("cart", JSON.stringify(cart.value));
  };
  const removeFromCart = (index2) => {
    cart.value.splice(index2, 1);
    localStorage.setItem("cart", JSON.stringify(cart.value));
  };
  const updateCartItemQuantity = ({ index: index2, quantity }) => {
    if (quantity < 1) return;
    cart.value[index2].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart.value));
  };
  const clearCart = () => {
    cart.value = [];
    localStorage.setItem("cart", JSON.stringify(cart.value));
  };
  const moveToSavedForLater = (index2) => {
    const item = cart.value[index2];
    savedForLater.value.push(item);
    removeFromCart(index2);
    localStorage.setItem("savedForLater", JSON.stringify(savedForLater.value));
  };
  const moveToCart = (index2) => {
    const item = savedForLater.value[index2];
    addToCart(item);
    savedForLater.value.splice(index2, 1);
    localStorage.setItem("savedForLater", JSON.stringify(savedForLater.value));
  };
  const addToRecentlyViewed = (product) => {
    const index2 = recentlyViewed.value.findIndex((p) => p.id === product.id);
    if (index2 > -1) {
      recentlyViewed.value.splice(index2, 1);
    }
    recentlyViewed.value.unshift(product);
    if (recentlyViewed.value.length > 4) {
      recentlyViewed.value.pop();
    }
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed.value));
  };
  const loadCartData = () => {
    const savedCart = localStorage.getItem("cart");
    const savedForLaterData = localStorage.getItem("savedForLater");
    const recentlyViewedData = localStorage.getItem("recentlyViewed");
    if (savedCart) cart.value = JSON.parse(savedCart);
    if (savedForLaterData) savedForLater.value = JSON.parse(savedForLaterData);
    if (recentlyViewedData) recentlyViewed.value = JSON.parse(recentlyViewedData);
  };
  return {
    // State
    cart,
    savedForLater,
    recentlyViewed,
    // Computed
    cartTotal,
    cartItemCount,
    shippingCost,
    remainingForFreeShipping,
    freeShippingProgress,
    // Methods
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    moveToSavedForLater,
    moveToCart,
    addToRecentlyViewed,
    loadCartData
  };
};
const _sfc_main$8 = {
  __name: "DesignCreator",
  __ssrInlineRender: true,
  props: {
    productId: { type: [String, Number], default: "E150" }
  },
  setup(__props) {
    const props2 = __props;
    ref(null);
    ref(null);
    useRouter$1();
    useCart();
    const showSizeModal = ref(false);
    const sizeQuantities = ref({});
    const isAdminMode = ref(false);
    const isEditingArea = ref(false);
    const isDrawingPolygon = ref(false);
    const customPolygon = ref([]);
    const selectedColor = ref(2);
    const colors = [
      { name: "Weiß", hex: "#f5f5f5" },
      { name: "Schwarz", hex: "#222" },
      { name: "Atoll", hex: "#1cc6ea" },
      { name: "Gelb", hex: "#ffe600" },
      { name: "Pink", hex: "#D8127D" },
      { name: "Grün", hex: "#6bbf59" },
      { name: "Rot", hex: "#e53935" },
      { name: "Blau", hex: "#1976d2" }
    ];
    const selectedObject = ref(null);
    ref(false);
    const showWarning = ref(false);
    const warningMessage = ref("");
    const availableSizes = computed(() => {
      const sizes = ["S", "M", "L", "XL", "XXL"];
      if (Object.keys(sizeQuantities.value).length === 0) {
        sizes.forEach((s) => {
          sizeQuantities.value[s] = 0;
        });
      }
      return sizes;
    });
    async function loadBackgroundViaFabric(url, useCors) {
      return new Promise((resolve) => {
        {
          resolve(false);
          return;
        }
      });
    }
    const selectedProduct = ref(null);
    const productImages = ref([]);
    const currentViewIndex = ref(0);
    const productName = computed(() => {
      var _a;
      return ((_a = selectedProduct.value) == null ? void 0 : _a.name) || "Unisex Basic T-Shirt";
    });
    const productDescription = computed(() => {
      var _a;
      const raw = ((_a = selectedProduct.value) == null ? void 0 : _a.description) || "";
      try {
        return raw.replace(/<[^>]*>/g, "").trim();
      } catch {
        return raw;
      }
    });
    async function loadBackgroundViaBlob(url) {
      try {
        const res = await fetch(url, { mode: "cors" });
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const ok = await loadBackgroundViaFabric(objectUrl, false);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 5e3);
        return ok;
      } catch {
        return false;
      }
    }
    async function loadViaHTMLImage(url) {
      return new Promise((resolve) => {
        {
          resolve(false);
          return;
        }
      });
    }
    async function loadBackground(url) {
      if (!url) return false;
      const proxied = `/api/proxy?url=${encodeURIComponent(url)}`;
      let ok = await loadViaHTMLImage();
      console.debug("[BG-TRY] proxy HTMLImage", proxied, ok);
      if (ok) return true;
      ok = await loadBackgroundViaFabric();
      console.debug("[BG-TRY] proxy Fabric", proxied, ok);
      if (ok) return true;
      ok = await loadViaHTMLImage();
      console.debug("[BG-TRY] direct HTMLImage", url, ok);
      if (ok) return true;
      ok = await loadBackgroundViaFabric();
      console.debug("[BG-TRY] fabric CORS", url, ok);
      if (ok) return true;
      ok = await loadBackgroundViaBlob(url);
      console.debug("[BG-TRY] blob", url, ok);
      if (ok) return true;
      ok = await loadBackgroundViaFabric();
      console.debug("[BG-TRY] fabric no-cors (tainted)", url, ok);
      return ok;
    }
    async function updateProductAndBackground(id) {
      return;
    }
    watch(() => props2.productId, (id) => id && updateProductAndBackground(), { immediate: true });
    watch(currentViewIndex, async (idx) => {
      var _a;
      const url = (_a = productImages.value) == null ? void 0 : _a[idx];
      if (url) {
        await loadBackground(url);
      }
    });
    const textColors = [
      { name: "Schwarz", hex: "#000000" },
      { name: "Weiß", hex: "#ffffff" },
      { name: "Rot", hex: "#e53935" },
      { name: "Blau", hex: "#1976d2" },
      { name: "Grün", hex: "#6bbf59" },
      { name: "Gelb", hex: "#ffe600" },
      { name: "Orange", hex: "#ff7a00" },
      { name: "Pink", hex: "#D8127D" },
      { name: "Lila", hex: "#8e24aa" },
      { name: "Grau", hex: "#666666" },
      { name: "Navy", hex: "#0a3a47" },
      { name: "Türkis", hex: "#30d5c8" }
    ];
    const availableFonts = [
      "Arial",
      "Helvetica",
      "Times New Roman",
      "Georgia",
      "Courier New",
      "Verdana",
      "Tahoma",
      "Trebuchet MS",
      "Impact",
      "Lucida Sans Unicode",
      "Garamond",
      "Palatino Linotype",
      "Century Gothic",
      "Calibri",
      "Comic Sans MS"
    ];
    const polygonButtonTitle = computed(() => {
      if (isDrawingPolygon.value) return "Punkt setzen (Enter fertig)";
      if (isEditingArea.value) return "Polygon bearbeiten (Punkte ziehen)";
      return "Polygon-Modus starten";
    });
    const polygonButtonHelp = computed(() => {
      if (isDrawingPolygon.value) return "Klicken zum Punkt setzen – Enter: fertig";
      if (isEditingArea.value) return "Ziehe Punkte, Esc: beenden";
      return "Erstelle eine Fläche durch Klicken";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="container mx-auto px-6 py-12" data-v-f6748212><div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8" data-v-f6748212><div class="lg:col-span-8" data-v-f6748212><div class="bg-white rounded-xl shadow-lg p-6" data-v-f6748212><div class="flex justify-between items-center mb-4" data-v-f6748212><h2 class="text-xl font-bold text-[#0a3a47]" data-v-f6748212>Shirt Designer</h2><div class="flex gap-2 relative z-20" data-v-f6748212><button class="btn-secondary" title="Zoom In" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" data-v-f6748212></path></svg></button><button class="btn-secondary" title="Zoom Out" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10v3m0-3H7" data-v-f6748212></path></svg></button><button class="btn-secondary" title="Zurücksetzen" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-f6748212></path></svg></button><button class="btn-secondary" title="Design exportieren" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-f6748212></path></svg></button>`);
      if (isAdminMode.value) {
        _push(`<div class="relative group" data-v-f6748212><button class="${ssrRenderClass([{ "bg-[#0a3a47] text-white": isDrawingPolygon.value || isEditingArea.value }, "btn-secondary"])}"${ssrRenderAttr("title", polygonButtonTitle.value)} data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4l16 16M4 20L20 4" data-v-f6748212></path></svg></button><span class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50" data-v-f6748212>${ssrInterpolate(polygonButtonHelp.value)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isAdminMode.value && customPolygon.value.length >= 3) {
        _push(`<div class="relative group" data-v-f6748212><button class="${ssrRenderClass([{ "bg-[#D8127D] text-white": isEditingArea.value }, "btn-secondary"])}" title="Polygon bearbeiten" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-.828.515L7 15l1.657-3.999a2 2 0 01.343-.6z" data-v-f6748212></path></svg></button><span class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50" data-v-f6748212>Punkte verschieben</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative group" data-v-f6748212><button class="${ssrRenderClass([{ "bg-[#0a3a47] text-white": isAdminMode.value }, "btn-secondary"])}" title="Admin Mode" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-v-f6748212></path></svg></button><span class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50" data-v-f6748212>Admin-Tools an/aus</span></div>`);
      if (isAdminMode.value) {
        _push(`<div class="relative group" data-v-f6748212><button class="btn-secondary" title="Area speichern" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h16v16H4zM8 12h8" data-v-f6748212></path></svg></button><span class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50" data-v-f6748212>Fläche speichern</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isAdminMode.value) {
        _push(`<div class="relative group" data-v-f6748212><button class="btn-secondary" title="Area löschen" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f6748212></path></svg></button><span class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50" data-v-f6748212>Fläche löschen</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="relative rounded-lg overflow-hidden" data-v-f6748212><canvas class="w-full h-[600px] cursor-crosshair" tabindex="0" data-v-f6748212></canvas>`);
      if (showWarning.value) {
        _push(`<div class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-10" data-v-f6748212><div class="flex items-center gap-2" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" data-v-f6748212></path></svg><span class="text-sm font-medium" data-v-f6748212>${ssrInterpolate(warningMessage.value)}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-2 text-xs text-gray-500" data-v-f6748212>Tipp: Objekte anklicken und mit der Maus ziehen, um sie zu bewegen.</div></div></div><div class="lg:col-span-4" data-v-f6748212><div class="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6" data-v-f6748212><div data-v-f6748212><h1 class="text-2xl font-bold mb-1" data-v-f6748212>${ssrInterpolate(productName.value)} <span class="text-xs text-gray-400" data-v-f6748212>#${ssrInterpolate(__props.productId)}</span></h1><div class="text-sm text-[#D8127D] font-semibold mb-2 flex items-center gap-2" data-v-f6748212></div></div><div data-v-f6748212><div class="space-y-3" data-v-f6748212><button class="btn w-full bg-[#D8127D] hover:bg-[#b0105f] text-white" data-v-f6748212><svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" data-v-f6748212></path></svg> Bild hochladen </button><input type="file" accept="image/*,.svg" class="hidden" data-v-f6748212><button class="btn w-full bg-[#ff7a00] hover:bg-[#ffa940] text-white" data-v-f6748212><svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-f6748212></path></svg> Text hinzufügen </button></div></div>`);
      if (productImages.value && productImages.value.length) {
        _push(`<div class="mt-4" data-v-f6748212><h3 class="font-semibold mb-2 text-[#0a3a47]" data-v-f6748212>Ansichten</h3><div class="flex gap-2 overflow-x-auto pb-2" data-v-f6748212><!--[-->`);
        ssrRenderList(productImages.value, (u, i) => {
          _push(`<button class="${ssrRenderClass(["rounded-md border", i === currentViewIndex.value ? "ring-2 ring-[#D8127D] border-[#D8127D]" : "border-gray-200"])}" data-v-f6748212><img${ssrRenderAttr("src", u)}${ssrRenderAttr("alt", "View " + (i + 1))} class="w-16 h-16 object-cover rounded-md" data-v-f6748212></button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div data-v-f6748212><div class="font-semibold mb-2 text-[#0a3a47]" data-v-f6748212>Shirt Farbe</div><div class="grid grid-cols-8 gap-2 mb-2" data-v-f6748212><!--[-->`);
      ssrRenderList(colors, (color, i) => {
        _push(`<button${ssrRenderAttr("title", color.name)} class="${ssrRenderClass(["w-7 h-7 rounded-full border-2", selectedColor.value === i ? "border-[#D8127D] ring-2 ring-[#ffd44d]" : "border-gray-200"])}" style="${ssrRenderStyle({ backgroundColor: color.hex })}" data-v-f6748212></button>`);
      });
      _push(`<!--]--></div><div class="text-xs text-gray-500" data-v-f6748212>Gewählte Farbe: <span class="font-semibold text-[#0a3a47]" data-v-f6748212>${ssrInterpolate(colors[selectedColor.value].name)}</span></div></div>`);
      if (selectedObject.value) {
        _push(`<div data-v-f6748212><h3 class="font-semibold mb-3 text-[#0a3a47]" data-v-f6748212>Design bearbeiten</h3><div class="space-y-3" data-v-f6748212><div class="flex gap-2" data-v-f6748212><button class="btn-secondary flex-1" title="Nach vorne" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" data-v-f6748212></path></svg></button><button class="btn-secondary flex-1" title="Nach hinten" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-f6748212></path></svg></button><button class="btn-secondary" title="Löschen" data-v-f6748212><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f6748212><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-v-f6748212></path></svg></button></div>`);
        if (selectedObject.value.type === "text") {
          _push(`<div class="space-y-3 p-3 border border-gray-200 rounded-md bg-white shadow-sm" data-v-f6748212><div data-v-f6748212><label class="block text-xs font-medium text-gray-700 mb-1" data-v-f6748212>Text</label><input${ssrRenderAttr("value", selectedObject.value.text)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D8127D]" data-v-f6748212></div><div data-v-f6748212><label class="block text-xs font-medium text-gray-700 mb-1" data-v-f6748212>Schriftgröße</label><input${ssrRenderAttr("value", selectedObject.value.fontSize)} type="range" min="12" max="72" class="w-full" data-v-f6748212><div class="text-xs text-gray-500 text-center" data-v-f6748212>${ssrInterpolate(selectedObject.value.fontSize)}px</div></div><div data-v-f6748212><label class="block text-xs font-medium text-gray-700 mb-1" data-v-f6748212>Farbe</label><div class="grid grid-cols-6 gap-1" data-v-f6748212><!--[-->`);
          ssrRenderList(textColors, (color) => {
            _push(`<button class="${ssrRenderClass(["w-6 h-6 rounded border", selectedObject.value.fill === color.hex ? "border-[#D8127D] ring-2" : "border-gray-200"])}" style="${ssrRenderStyle({ backgroundColor: color.hex })}"${ssrRenderAttr("title", color.name)} data-v-f6748212></button>`);
          });
          _push(`<!--]--></div></div><div data-v-f6748212><label class="block text-xs font-medium text-gray-700 mb-1" data-v-f6748212>Schriftart</label><select class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D8127D]" data-v-f6748212><!--[-->`);
          ssrRenderList(availableFonts, (f) => {
            _push(`<option${ssrRenderAttr("value", f)} data-v-f6748212${ssrIncludeBooleanAttr(Array.isArray(selectedObject.value.fontFamily) ? ssrLooseContain(selectedObject.value.fontFamily, f) : ssrLooseEqual(selectedObject.value.fontFamily, f)) ? " selected" : ""}>${ssrInterpolate(f)}</option>`);
          });
          _push(`<!--]--></select></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (selectedObject.value.type === "image") {
          _push(`<div class="space-y-3" data-v-f6748212><div data-v-f6748212><label class="block text-xs font-medium text-gray-700 mb-1" data-v-f6748212>Transparenz</label><input${ssrRenderAttr("value", selectedObject.value.opacity)} type="range" min="0.1" max="1" step="0.1" class="w-full" data-v-f6748212><div class="text-xs text-gray-500 text-center" data-v-f6748212>${ssrInterpolate(Math.round(selectedObject.value.opacity * 100))}%</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div data-v-f6748212><details class="mb-2" data-v-f6748212><summary class="cursor-pointer font-semibold text-[#D8127D]" data-v-f6748212>Produktinformationen</summary><div class="text-xs text-gray-600 mt-2" data-v-f6748212>${ssrInterpolate(productDescription.value || "Produktbeschreibung folgt.")}</div></details><details data-v-f6748212><summary class="cursor-pointer font-semibold text-[#D8127D]" data-v-f6748212>Aktueller Lagerbestand</summary><div class="text-xs text-gray-600 mt-2" data-v-f6748212>Viele Größen und Farben sofort verfügbar.</div></details></div><div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-2" data-v-f6748212><div class="flex justify-between items-center" data-v-f6748212><span class="font-semibold text-[#0a3a47]" data-v-f6748212>Gesamtsumme</span><span class="text-lg font-bold text-[#D8127D]" data-v-f6748212>11,90 €</span></div><div class="text-xs text-gray-500" data-v-f6748212>inkl. MwSt. EU / inkl. Druckkosten / zzgl. <a href="#" class="underline text-[#D8127D]" data-v-f6748212>Versand</a></div><div class="text-sm text-[#0a3a47] font-semibold mt-2" data-v-f6748212>Lieferung in der Regel innerhalb von 4 Werktagen</div></div><button class="btn w-full bg-[#ff7a00] hover:bg-[#ffa940] text-white text-lg font-bold py-3 rounded-lg mt-2" data-v-f6748212> Größe und Menge wählen </button></div></div></div></div>`);
      if (showSizeModal.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center" data-v-f6748212><div class="absolute inset-0 bg-black/40" data-v-f6748212></div><div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6" data-v-f6748212><h3 class="text-lg font-semibold text-[#0a3a47] mb-4" data-v-f6748212>Größe und Menge wählen</h3><div class="space-y-3 max-h-[50vh] overflow-y-auto pr-1" data-v-f6748212><!--[-->`);
        ssrRenderList(availableSizes.value, (size) => {
          _push(`<div class="flex items-center justify-between gap-4" data-v-f6748212><div class="font-medium text-sm text-[#0a3a47]" data-v-f6748212>${ssrInterpolate(size)}</div><input type="number" min="0" step="1" class="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"${ssrRenderAttr("value", sizeQuantities.value[size])} data-v-f6748212></div>`);
        });
        _push(`<!--]--></div><div class="flex justify-end gap-2 mt-6" data-v-f6748212><button class="btn btn-secondary" data-v-f6748212>Abbrechen</button><button class="btn bg-[#ff7a00] hover:bg-[#ffa940] text-white" data-v-f6748212>Weiter zur Kasse</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DesignCreator.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props2, ctx) : void 0;
};
const DesignCreator = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-f6748212"]]);
const _sfc_main$7 = {
  __name: "customization-creator",
  __ssrInlineRender: true,
  setup(__props) {
    ref(false);
    const products = ref([]);
    const designerProducts = computed(() => products.value.filter((p) => {
      var _a;
      return (_a = p.tags) == null ? void 0 : _a.includes("designer");
    }));
    const activeProductId = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-f7f4691d><section class="bg-white" data-v-f7f4691d><div class="container mx-auto px-6 py-12 text-center" data-v-f7f4691d><h1 class="text-4xl font-extrabold tracking-tight mb-2" data-v-f7f4691d>Gestalte dein Produkt</h1><p class="text-gray-600 mb-6" data-v-f7f4691d>Wähle ein Produkt und starte dein Design.</p></div></section><section class="bg-gray-50" data-v-f7f4691d><div class="container mx-auto px-6 py-8" data-v-f7f4691d><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-v-f7f4691d><!--[-->`);
      ssrRenderList(designerProducts.value, (p) => {
        _push(`<div class="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer" data-v-f7f4691d><img${ssrRenderAttr("src", p.image)}${ssrRenderAttr("alt", p.name)} class="w-full h-56 object-contain" data-v-f7f4691d><div class="p-4" data-v-f7f4691d><div class="font-semibold" data-v-f7f4691d>${ssrInterpolate(p.name)}</div>`);
        if (p.price) {
          _push(`<div class="text-sm text-gray-500" data-v-f7f4691d>ab ${ssrInterpolate(p.price)} €</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div></section><div class="container mx-auto px-6 py-12" data-v-f7f4691d>`);
      _push(ssrRenderComponent(DesignCreator, { productId: activeProductId.value }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/customization-creator.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props2, ctx) : void 0;
};
const CustomizationCreatorPage = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-f7f4691d"]]);
const customizationCreator = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CustomizationCreatorPage
}, Symbol.toStringTag, { value: "Module" }));
const _imports_0 = "" + __buildAssetsURL("shirt.DKYRlG6X.svg");
const _imports_1 = "" + __buildAssetsURL("printarea-kinder.BLE94HFQ.svg");
const _sfc_main$6 = {
  __name: "product-detail",
  __ssrInlineRender: true,
  props: {
    selectedProduct: {
      type: Object,
      default: null
    }
  },
  emits: ["navigate", "addToCart"],
  setup(__props, { emit: __emit }) {
    const props2 = __props;
    const selectedImage = ref(null);
    const selectedColor = ref(null);
    const quantity = ref(1);
    const selectedTab = ref("Beschreibung");
    const sizeQuantities = ref({});
    const sizeChart = [
      { g: "XS", a: "68,0", b: "45,0", c: "17,0" },
      { g: "S", a: "70,0", b: "48,0", c: "17,0" },
      { g: "M", a: "72,0", b: "51,0", c: "18,0" },
      { g: "L", a: "74,0", b: "54,0", c: "19,0" },
      { g: "XL", a: "76,0", b: "57,0", c: "20,0" },
      { g: "XXL", a: "78,0", b: "60,0", c: "21,0" }
    ];
    watch(() => props2.selectedProduct, (newProduct) => {
      if (newProduct && newProduct.sizes) {
        const initial = {};
        newProduct.sizes.forEach((size) => {
          initial[size] = 0;
        });
        sizeQuantities.value = initial;
      }
      if (newProduct && newProduct.gallery && newProduct.gallery.length > 0) {
        selectedImage.value = newProduct.gallery[0];
      }
    }, { immediate: true });
    const totalSelectedQuantity = computed(() => {
      var _a;
      if (!((_a = props2.selectedProduct) == null ? void 0 : _a.sizes)) return quantity.value;
      return Object.values(sizeQuantities.value).reduce((sum, n) => sum + n, 0);
    });
    computed(() => {
      var _a;
      return totalSelectedQuantity.value * (parseFloat((_a = props2.selectedProduct) == null ? void 0 : _a.price) || 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.selectedProduct) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-6 py-12" }, _attrs))} data-v-6cda0867><div class="flex items-center space-x-2 text-sm text-gray-500 mb-8" data-v-6cda0867><a class="hover:text-[#D8127D] cursor-pointer" data-v-6cda0867>Home</a><span data-v-6cda0867>/</span><a class="hover:text-[#D8127D] cursor-pointer" data-v-6cda0867>${ssrInterpolate(__props.selectedProduct.customizable ? "Individuell gestalten" : "Fertige Produkte")}</a><span data-v-6cda0867>/</span><span class="text-gray-900" data-v-6cda0867>${ssrInterpolate(__props.selectedProduct.name)}</span></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-12" data-v-6cda0867><div class="space-y-4" data-v-6cda0867><div class="relative aspect-square rounded-lg overflow-hidden" data-v-6cda0867><img${ssrRenderAttr("src", selectedImage.value || __props.selectedProduct.image)}${ssrRenderAttr("alt", __props.selectedProduct.name)} class="w-full h-full object-cover" data-v-6cda0867>`);
        if (__props.selectedProduct.customizable) {
          _push(`<div class="absolute top-4 left-4 bg-[#D8127D] text-white px-3 py-1 rounded-full text-sm" data-v-6cda0867> Individuell gestaltbar </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="grid grid-cols-4 gap-4" data-v-6cda0867><!--[-->`);
        ssrRenderList(__props.selectedProduct.gallery, (image, index2) => {
          _push(`<button class="${ssrRenderClass([selectedImage.value === image ? "border-[#D8127D]" : "border-transparent", "aspect-square rounded-lg overflow-hidden border-2"])}" data-v-6cda0867><img${ssrRenderAttr("src", image)}${ssrRenderAttr("alt", `${__props.selectedProduct.name} - Bild ${index2 + 1}`)} class="w-full h-full object-cover" data-v-6cda0867></button>`);
        });
        _push(`<!--]--></div></div><div data-v-6cda0867><h1 class="text-3xl font-bold mb-2" data-v-6cda0867>${ssrInterpolate(__props.selectedProduct.name)}</h1><div class="flex items-center space-x-4 mb-4" data-v-6cda0867><p class="text-2xl text-[#D8127D] font-bold" data-v-6cda0867>${ssrInterpolate(__props.selectedProduct.price)} €</p>`);
        if (__props.selectedProduct.customizable) {
          _push(`<span class="text-gray-500" data-v-6cda0867>Ab</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center" data-v-6cda0867><span class="text-yellow-400" data-v-6cda0867>★★★★★</span><span class="ml-2 text-gray-600" data-v-6cda0867>(4.9)</span></div></div><div class="prose max-w-none mb-8" data-v-6cda0867><p data-v-6cda0867>${ssrInterpolate(__props.selectedProduct.description)}</p></div><div class="space-y-6" data-v-6cda0867>`);
        if (__props.selectedProduct.sizes) {
          _push(`<div data-v-6cda0867><div class="flex justify-between items-center mb-2" data-v-6cda0867><h3 class="font-semibold" data-v-6cda0867>Größe / Menge wählen</h3><button class="text-sm text-[#D8127D] hover:underline" data-v-6cda0867>Größentabelle</button></div><div class="divide-y divide-gray-200 border rounded-lg overflow-hidden" data-v-6cda0867><!--[-->`);
          ssrRenderList(__props.selectedProduct.sizes, (size) => {
            _push(`<div class="flex items-center px-4 py-2" data-v-6cda0867><span class="w-12 font-bold text-gray-800" data-v-6cda0867>${ssrInterpolate(size)}</span><div class="flex items-center ml-auto" data-v-6cda0867><button class="w-8 h-8 border rounded-l flex items-center justify-center text-gray-700 hover:bg-gray-100" data-v-6cda0867>-</button><input type="number"${ssrRenderAttr("value", sizeQuantities.value[size])} min="0" class="w-12 text-center border-t border-b focus:outline-none" data-v-6cda0867><button class="w-8 h-8 border rounded-r flex items-center justify-center text-gray-700 hover:bg-gray-100" data-v-6cda0867>+</button></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.selectedProduct.colors) {
          _push(`<div data-v-6cda0867><h3 class="font-semibold mb-2" data-v-6cda0867>Farbe</h3><div class="flex flex-wrap gap-2" data-v-6cda0867><!--[-->`);
          ssrRenderList(__props.selectedProduct.colors, (color) => {
            _push(`<button class="${ssrRenderClass([selectedColor.value === color ? "border-[#D8127D]" : "border-transparent", "w-8 h-8 rounded-full border-2 transition"])}" style="${ssrRenderStyle({ backgroundColor: color })}" data-v-6cda0867></button>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!__props.selectedProduct.sizes) {
          _push(`<div data-v-6cda0867><h3 class="font-semibold mb-2" data-v-6cda0867>Menge</h3><div class="flex items-center gap-4" data-v-6cda0867><button class="w-10 h-10 border rounded-lg hover:border-[#D8127D] hover:text-[#D8127D] transition" data-v-6cda0867> - </button><input type="number"${ssrRenderAttr("value", quantity.value)} min="1" class="w-20 text-center border rounded-lg focus:border-[#D8127D] focus:ring-1 focus:ring-[#D8127D]" data-v-6cda0867><button class="w-10 h-10 border rounded-lg hover:border-[#D8127D] hover:text-[#D8127D] transition" data-v-6cda0867> + </button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex gap-4" data-v-6cda0867>`);
        if (__props.selectedProduct.customizable) {
          _push(`<button class="btn bg-[#D8127D] text-white flex-1 hover:bg-[#b30f68]" data-v-6cda0867> Jetzt gestalten </button>`);
        } else {
          _push(`<button class="btn bg-[#D8127D] text-white flex-1 hover:bg-[#b30f68]" data-v-6cda0867> In den Warenkorb </button>`);
        }
        _push(`<button class="btn border-2 border-gray-300 hover:border-[#D8127D] hover:text-[#D8127D]" data-v-6cda0867><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-6cda0867><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" data-v-6cda0867></path></svg></button></div><div class="grid grid-cols-2 gap-4 pt-6 border-t" data-v-6cda0867><div class="flex items-center space-x-2" data-v-6cda0867><svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-6cda0867><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-6cda0867></path></svg><span class="text-sm" data-v-6cda0867>Kostenloser Versand</span></div><div class="flex items-center space-x-2" data-v-6cda0867><svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-6cda0867><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" data-v-6cda0867></path></svg><span class="text-sm" data-v-6cda0867>2 Jahre Garantie</span></div><div class="flex items-center space-x-2" data-v-6cda0867><svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-6cda0867><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" data-v-6cda0867></path></svg><span class="text-sm" data-v-6cda0867>Sicherer Zahlung</span></div><div class="flex items-center space-x-2" data-v-6cda0867><svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-6cda0867><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-v-6cda0867></path></svg><span class="text-sm" data-v-6cda0867>Persönlicher Service</span></div></div></div></div></div><div class="mt-16" data-v-6cda0867><div class="border-b border-gray-200" data-v-6cda0867><nav class="flex space-x-8" data-v-6cda0867><!--[-->`);
        ssrRenderList(["Beschreibung", "Material & Pflege", "Versand & Rücksendung", "Bewertungen"], (tab) => {
          _push(`<button class="${ssrRenderClass([selectedTab.value === tab ? "border-[#D8127D] text-[#D8127D]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300", "py-4 px-1 border-b-2 font-medium text-sm"])}" data-v-6cda0867>${ssrInterpolate(tab)}</button>`);
        });
        _push(`<!--]--></nav></div><div class="py-8" data-v-6cda0867>`);
        if (selectedTab.value === "Beschreibung") {
          _push(`<div class="prose max-w-none" data-v-6cda0867><p data-v-6cda0867>${ssrInterpolate(__props.selectedProduct.description)}</p><ul data-v-6cda0867><li data-v-6cda0867>Hochwertige Materialien</li><li data-v-6cda0867>Nachhaltige Produktion</li><li data-v-6cda0867>Made in Germany</li></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (selectedTab.value === "Material & Pflege") {
          _push(`<div class="prose max-w-none" data-v-6cda0867><h3 class="text-lg font-semibold mb-4" data-v-6cda0867>Material</h3><p data-v-6cda0867>100% Bio-Baumwolle, GOTS zertifiziert</p><h3 class="text-lg font-semibold mb-4 mt-8" data-v-6cda0867>Pflegehinweise</h3><ul data-v-6cda0867><li data-v-6cda0867>Maschinenwäsche bei 30°C</li><li data-v-6cda0867>Nicht bleichen</li><li data-v-6cda0867>Bügeln bei mittlerer Temperatur</li><li data-v-6cda0867>Nicht chemisch reinigen</li></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (selectedTab.value === "Versand & Rücksendung") {
          _push(`<div class="prose max-w-none" data-v-6cda0867><h3 class="text-lg font-semibold mb-4" data-v-6cda0867>Versand</h3><ul data-v-6cda0867><li data-v-6cda0867>Kostenloser Versand ab 50€</li><li data-v-6cda0867>Standardversand: 2-4 Werktage</li><li data-v-6cda0867>Expressversand: 1-2 Werktage</li></ul><h3 class="text-lg font-semibold mb-4 mt-8" data-v-6cda0867>Rücksendung</h3><ul data-v-6cda0867><li data-v-6cda0867>14 Tage Rückgaberecht</li><li data-v-6cda0867>Kostenlose Rücksendung</li><li data-v-6cda0867>Einfacher Rückgabeprozess</li></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (selectedTab.value === "Bewertungen") {
          _push(`<div class="space-y-8" data-v-6cda0867><div class="flex items-center space-x-4" data-v-6cda0867><div class="text-4xl font-bold text-[#D8127D]" data-v-6cda0867>4.9</div><div data-v-6cda0867><div class="flex text-yellow-400" data-v-6cda0867><span data-v-6cda0867>★★★★★</span></div><div class="text-sm text-gray-500" data-v-6cda0867>Basierend auf 128 Bewertungen</div></div></div><div class="space-y-6" data-v-6cda0867><!--[-->`);
          ssrRenderList(3, (i) => {
            _push(`<div class="border-b pb-6" data-v-6cda0867><div class="flex items-center space-x-4 mb-2" data-v-6cda0867><div class="w-10 h-10 rounded-full bg-gray-200" data-v-6cda0867></div><div data-v-6cda0867><div class="font-semibold" data-v-6cda0867>Max Mustermann</div><div class="text-sm text-gray-500" data-v-6cda0867>Vor 2 Wochen</div></div></div><div class="flex text-yellow-400 mb-2" data-v-6cda0867>★★★★★</div><p class="text-gray-600" data-v-6cda0867>Sehr zufrieden mit der Qualität und dem Service. Die Lieferung war schnell und das Produkt entspricht genau der Beschreibung.</p></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="mt-12" data-v-6cda0867><section class="bg-[#f8f8f6] border-t border-gray-200 py-10" data-v-6cda0867><div class="container mx-auto px-6 grid md:grid-cols-2 gap-12" data-v-6cda0867><div data-v-6cda0867><h2 class="text-2xl font-bold mb-2" data-v-6cda0867>${ssrInterpolate(__props.selectedProduct.name)}</h2><h3 class="font-semibold mb-2" data-v-6cda0867>Dieses Basic T-Shirt sorgt für einen modernen Look</h3><p class="mb-4 text-gray-700" data-v-6cda0867>Das Basic T-Shirt für Frauen und Männer aus der B&amp;C Collection steht für eine zeitgemäße Passform und eine moderne Optik. Die zu 100% ringgesponnene, einlaufvorbehandelte Baumwolle (Ash: 99% Baumwolle, 1% Viskose; Sport Grey: 85% Baumwolle, 15% Viskose) mit einer Stoffdichte von 145 g/m² ist besonders strapazierfähig und weist eine ebenmäßige und weiche Oberfläche auf. Der schlauchförmige Schnitt hebt die hervorragende Passform weiter hervor.</p><h4 class="font-semibold mb-2" data-v-6cda0867>Ein schickes T-Shirt für alle Tage</h4><p class="mb-4 text-gray-700" data-v-6cda0867>Wenn man sich leicht und locker einkleiden möchte, dann hat das Unisex Basic T-Shirt seinen ganz großen Auftritt. Es steht für Lässigkeit und punktet mit seinem innovativen Design. Das T-Shirt lässt sich in vielen verschiedenen Farben bestellen. Der schmale Kragen sieht ansprechend aus, wurde er doch aus flexiblem Rippstrick mit Elasthan gefertigt. Im Nacken ist für mehr Formstabilität ein Kragenband verarbeitet. Das Label B&amp;C setzt sich zudem für faire Arbeitsbedingungen in den Produktionsstätten ein. Dafür sorgt die Mitgliedschaft in der Fair Wear Foundation.</p><div class="bg-blue-100 border border-blue-300 rounded p-3 mb-4" data-v-6cda0867><span class="font-semibold text-blue-800 block mb-1" data-v-6cda0867>Hinweis zur Farbe Natural:</span><span class="text-blue-800 text-sm" data-v-6cda0867>Die natürliche Struktur des Natural Garns ist sichtbar.</span></div><table class="w-full text-sm mb-4" data-v-6cda0867><tbody data-v-6cda0867><tr data-v-6cda0867><td class="font-semibold pr-2" data-v-6cda0867>Artikel-Nr.:</td><td data-v-6cda0867>BCTU01T</td></tr><tr data-v-6cda0867><td class="font-semibold pr-2" data-v-6cda0867>Hersteller:</td><td data-v-6cda0867>B&amp;C</td></tr><tr data-v-6cda0867><td class="font-semibold pr-2" data-v-6cda0867>Herstellungsland:</td><td data-v-6cda0867>Bangladesch</td></tr><tr data-v-6cda0867><td class="font-semibold pr-2" data-v-6cda0867>Druckarten:</td><td data-v-6cda0867>Flexdruck, Flockdruck, Spezial Flexdruck, Digitaltransferdruck</td></tr><tr data-v-6cda0867><td class="font-semibold pr-2" data-v-6cda0867>Materialzusammensetzung:</td><td data-v-6cda0867>100% einlaufvorbehandelte, ringgesponnene Baumwolle (Ash: 99% Baumwolle, 1% Viskose; Sport Grey: 85% Baumwolle, 15% Viskose)</td></tr><tr data-v-6cda0867><td class="font-semibold pr-2" data-v-6cda0867>Produktsicherheit (GPSR):</td><td data-v-6cda0867>The Cotton Group SA/NV, Drève Richelle 161, 1410 Waterloo, Belgium, info@bc-collection.eu</td></tr></tbody></table></div><div data-v-6cda0867><h3 class="font-semibold mb-2" data-v-6cda0867>Größentabelle</h3><div class="flex items-center mb-2" data-v-6cda0867><img${ssrRenderAttr("src", _imports_0)} alt="Größentabelle Illustration" class="w-24 h-24 mr-4" data-v-6cda0867><table class="text-xs border-collapse" data-v-6cda0867><thead data-v-6cda0867><tr class="text-left" data-v-6cda0867><th class="pr-2" data-v-6cda0867>Größe</th><th class="pr-2" data-v-6cda0867>Maß A (cm)</th><th class="pr-2" data-v-6cda0867>Maß B (cm)</th><th data-v-6cda0867>Maß C (cm)</th></tr></thead><tbody data-v-6cda0867><!--[-->`);
        ssrRenderList(sizeChart, (row) => {
          _push(`<tr data-v-6cda0867><td class="pr-2" data-v-6cda0867>${ssrInterpolate(row.g)}</td><td class="pr-2" data-v-6cda0867>${ssrInterpolate(row.a)}</td><td class="pr-2" data-v-6cda0867>${ssrInterpolate(row.b)}</td><td data-v-6cda0867>${ssrInterpolate(row.c)}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div><div class="text-xs text-gray-500 mb-4" data-v-6cda0867>A = Länge in cm, B = Breite in cm, C = Länge in cm<br data-v-6cda0867>Es kann eine handelsübliche Toleranz von +/- 5% bestehen!</div><h4 class="font-semibold mb-2" data-v-6cda0867>Design- und Produktgröße</h4><p class="text-sm mb-2" data-v-6cda0867>Unsere Produktbilder zeigen Durchschnittsgrößen. Bestellst Du ein besonders großes Produkt, wird das Design nicht automatisch an den größeren Druckbereich angepasst.</p><p class="text-xs text-gray-600 mb-2" data-v-6cda0867>Unser Tipp: Zieh Dein Design größer, damit es zur Größe Deines Produkts passt. <a href="#" class="text-[#D8127D] underline" data-v-6cda0867>Mehr erfahren</a></p><div class="flex items-end gap-2 mt-4" data-v-6cda0867><img${ssrRenderAttr("src", _imports_1)} alt="Printarea Kinder" class="h-60" data-v-6cda0867></div></div></div><div class="container mx-auto px-6 mt-10 grid md:grid-cols-3 gap-8 text-center text-xs text-gray-700" data-v-6cda0867><div data-v-6cda0867><div class="font-semibold mb-2" data-v-6cda0867>Sichere Zahlungsmethoden</div><div class="flex justify-center gap-2 mb-2" data-v-6cda0867><span data-v-6cda0867>PayPal</span><span data-v-6cda0867>Klarna</span><span data-v-6cda0867>VISA</span><span data-v-6cda0867>Mastercard</span></div><a href="#" class="underline" data-v-6cda0867>Mehr erfahren</a></div><div data-v-6cda0867><div class="font-semibold mb-2" data-v-6cda0867>Internationale Lieferung</div><div class="flex justify-center gap-2 mb-2" data-v-6cda0867><span data-v-6cda0867>DHL</span><span data-v-6cda0867>UPS</span><span data-v-6cda0867>Express</span></div><a href="#" class="underline" data-v-6cda0867>Mehr zum Versand erfahren</a></div><div data-v-6cda0867><div class="font-semibold mb-2" data-v-6cda0867>Unsere fairen Rückgaberegeln</div><div class="flex justify-center gap-2 mb-2" data-v-6cda0867><span data-v-6cda0867>14 Tage Rückgaberecht</span></div><a href="#" class="underline" data-v-6cda0867>Mehr erfahren</a></div></div></section></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product-detail.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props2, ctx) : void 0;
};
const ProductDetailPage = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-6cda0867"]]);
const productDetail = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductDetailPage
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$5 = {
  __name: "grossbestellung",
  __ssrInlineRender: true,
  setup(__props) {
    const isSubmitting = ref(false);
    const formData = ref({
      company: "",
      email: "",
      phone: "",
      quantity: "",
      message: "",
      file: null
    });
    const b2bBenefits = ref([
      { title: "Attraktive Mengenrabatte", description: "Sparen Sie bei größeren Bestellungen für Ihr Team.", icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
      { title: "Persönliche Beratung", description: "Ein fester Ansprechpartner begleitet Ihr Projekt.", icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
      { title: "Kauf auf Rechnung", description: "Bequeme und sichere Zahlung für Geschäftskunden.", icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white" }, _attrs))} data-v-7e678e8f><div class="container mx-auto px-6 py-16" data-v-7e678e8f><div class="max-w-4xl mx-auto" data-v-7e678e8f><h1 class="text-4xl font-bold text-center mb-4" data-v-7e678e8f>Großbestellungen für Ihr Business</h1><p class="text-xl text-gray-600 text-center mb-12" data-v-7e678e8f>Perfekt für Firmen, Vereine, Events und Merchandise.</p><div class="grid md:grid-cols-3 gap-8 text-center mb-16" data-v-7e678e8f><!--[-->`);
      ssrRenderList(b2bBenefits.value, (benefit) => {
        _push(`<div class="p-4" data-v-7e678e8f><div class="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4" data-v-7e678e8f><svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-7e678e8f>${benefit.icon ?? ""}</svg></div><h3 class="text-lg font-semibold" data-v-7e678e8f>${ssrInterpolate(benefit.title)}</h3><p class="text-sm text-gray-500" data-v-7e678e8f>${ssrInterpolate(benefit.description)}</p></div>`);
      });
      _push(`<!--]--></div><div class="bg-gray-50 p-8 rounded-xl border border-gray-200" data-v-7e678e8f><h2 class="text-2xl font-bold mb-6 text-center" data-v-7e678e8f>Unverbindliche Anfrage stellen</h2><form class="space-y-6" data-v-7e678e8f><div class="grid md:grid-cols-2 gap-6" data-v-7e678e8f><input${ssrRenderAttr("value", formData.value.company)} type="text" placeholder="Firma / Name*" class="form-input" required data-v-7e678e8f><input${ssrRenderAttr("value", formData.value.email)} type="email" placeholder="E-Mail*" class="form-input" required data-v-7e678e8f></div><input${ssrRenderAttr("value", formData.value.phone)} type="tel" placeholder="Telefon (optional)" class="form-input" data-v-7e678e8f><input${ssrRenderAttr("value", formData.value.quantity)} type="number" placeholder="Geschätzte Stückzahl*" class="form-input" required data-v-7e678e8f><textarea placeholder="Ihre Nachricht an uns..." rows="5" class="form-input" data-v-7e678e8f>${ssrInterpolate(formData.value.message)}</textarea><div data-v-7e678e8f><label class="block mb-2 text-sm font-medium text-gray-700" data-v-7e678e8f>Design hochladen (optional)</label><input type="file" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" data-v-7e678e8f></div><div class="text-center" data-v-7e678e8f><button type="submit" class="btn btn-primary btn-lg"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} data-v-7e678e8f>${ssrInterpolate(isSubmitting.value ? "Wird gesendet..." : "Anfrage senden")}</button></div></form></div></div></div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/grossbestellung.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props2, ctx) : void 0;
};
const GrossbestellungPage = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-7e678e8f"]]);
const grossbestellung = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GrossbestellungPage
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = {
  __name: "checkout",
  __ssrInlineRender: true,
  props: {
    cart: {
      type: Array,
      default: () => []
    }
  },
  emits: ["completeOrder"],
  setup(__props, { emit: __emit }) {
    const props2 = __props;
    const checkoutStep = ref(1);
    const shippingAddress = ref({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Deutschland"
    });
    const paymentMethod = ref("credit_card");
    const orderNotes = ref("");
    const cartTotal = computed(() => {
      return props2.cart.reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-6 py-12" }, _attrs))} data-v-2b890dd2><div class="max-w-4xl mx-auto" data-v-2b890dd2><h1 class="text-3xl font-bold mb-8" data-v-2b890dd2>Zur Kasse</h1><div class="flex justify-between mb-8" data-v-2b890dd2><!--[-->`);
      ssrRenderList(3, (step) => {
        _push(`<div class="${ssrRenderClass(["flex-1 text-center", checkoutStep.value >= step ? "text-[#D8127D]" : "text-gray-400"])}" data-v-2b890dd2><div class="${ssrRenderClass([checkoutStep.value >= step ? "border-[#D8127D]" : "border-gray-400", "w-8 h-8 rounded-full border-2 mx-auto mb-2 flex items-center justify-center"])}" data-v-2b890dd2>${ssrInterpolate(step)}</div><span class="text-sm" data-v-2b890dd2>${ssrInterpolate(step === 1 ? "Versand" : step === 2 ? "Zahlung" : "Bestätigung")}</span></div>`);
      });
      _push(`<!--]--></div>`);
      if (checkoutStep.value === 1) {
        _push(`<div class="bg-white p-6 rounded-lg shadow-md" data-v-2b890dd2><h2 class="text-xl font-semibold mb-4" data-v-2b890dd2>Versandadresse</h2><form class="space-y-4" data-v-2b890dd2><div class="grid grid-cols-2 gap-4" data-v-2b890dd2><input${ssrRenderAttr("value", shippingAddress.value.firstName)} type="text" placeholder="Vorname" required class="form-input" data-v-2b890dd2><input${ssrRenderAttr("value", shippingAddress.value.lastName)} type="text" placeholder="Nachname" required class="form-input" data-v-2b890dd2></div><input${ssrRenderAttr("value", shippingAddress.value.email)} type="email" placeholder="E-Mail" required class="form-input" data-v-2b890dd2><input${ssrRenderAttr("value", shippingAddress.value.phone)} type="tel" placeholder="Telefon" required class="form-input" data-v-2b890dd2><input${ssrRenderAttr("value", shippingAddress.value.address)} type="text" placeholder="Adresse" required class="form-input" data-v-2b890dd2><div class="grid grid-cols-2 gap-4" data-v-2b890dd2><input${ssrRenderAttr("value", shippingAddress.value.city)} type="text" placeholder="Stadt" required class="form-input" data-v-2b890dd2><input${ssrRenderAttr("value", shippingAddress.value.postalCode)} type="text" placeholder="PLZ" required class="form-input" data-v-2b890dd2></div><select class="form-input" data-v-2b890dd2><option value="Deutschland" data-v-2b890dd2${ssrIncludeBooleanAttr(Array.isArray(shippingAddress.value.country) ? ssrLooseContain(shippingAddress.value.country, "Deutschland") : ssrLooseEqual(shippingAddress.value.country, "Deutschland")) ? " selected" : ""}>Deutschland</option><option value="Österreich" data-v-2b890dd2${ssrIncludeBooleanAttr(Array.isArray(shippingAddress.value.country) ? ssrLooseContain(shippingAddress.value.country, "Österreich") : ssrLooseEqual(shippingAddress.value.country, "Österreich")) ? " selected" : ""}>Österreich</option><option value="Schweiz" data-v-2b890dd2${ssrIncludeBooleanAttr(Array.isArray(shippingAddress.value.country) ? ssrLooseContain(shippingAddress.value.country, "Schweiz") : ssrLooseEqual(shippingAddress.value.country, "Schweiz")) ? " selected" : ""}>Schweiz</option></select><button type="submit" class="btn bg-[#D8127D] text-white w-full" data-v-2b890dd2>Weiter zur Zahlung</button></form></div>`);
      } else {
        _push(`<!---->`);
      }
      if (checkoutStep.value === 2) {
        _push(`<div class="bg-white p-6 rounded-lg shadow-md" data-v-2b890dd2><h2 class="text-xl font-semibold mb-4" data-v-2b890dd2>Zahlungsmethode</h2><div class="space-y-4" data-v-2b890dd2><div class="${ssrRenderClass([paymentMethod.value === "credit_card" ? "border-[#D8127D]" : "border-gray-200", "flex items-center space-x-4 p-4 border rounded-lg cursor-pointer"])}" data-v-2b890dd2><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(paymentMethod.value, "credit_card")) ? " checked" : ""} value="credit_card" class="text-[#D8127D]" data-v-2b890dd2><div data-v-2b890dd2><h3 class="font-semibold" data-v-2b890dd2>Kreditkarte</h3><p class="text-sm text-gray-500" data-v-2b890dd2>Visa, Mastercard, American Express</p></div></div><div class="${ssrRenderClass([paymentMethod.value === "paypal" ? "border-[#D8127D]" : "border-gray-200", "flex items-center space-x-4 p-4 border rounded-lg cursor-pointer"])}" data-v-2b890dd2><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(paymentMethod.value, "paypal")) ? " checked" : ""} value="paypal" class="text-[#D8127D]" data-v-2b890dd2><div data-v-2b890dd2><h3 class="font-semibold" data-v-2b890dd2>PayPal</h3><p class="text-sm text-gray-500" data-v-2b890dd2>Schnell und sicher bezahlen</p></div></div><textarea placeholder="Bestellnotizen (optional)" class="form-input" rows="3" data-v-2b890dd2>${ssrInterpolate(orderNotes.value)}</textarea><div class="flex justify-between" data-v-2b890dd2><button class="btn border-2 border-gray-300" data-v-2b890dd2>Zurück</button><button class="btn bg-[#D8127D] text-white" data-v-2b890dd2>Weiter zur Bestätigung</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (checkoutStep.value === 3) {
        _push(`<div class="bg-white p-6 rounded-lg shadow-md" data-v-2b890dd2><h2 class="text-xl font-semibold mb-4" data-v-2b890dd2>Bestellung bestätigen</h2><div class="space-y-6" data-v-2b890dd2><div class="border-b pb-4" data-v-2b890dd2><h3 class="font-semibold mb-2" data-v-2b890dd2>Versandadresse</h3><p data-v-2b890dd2>${ssrInterpolate(shippingAddress.value.firstName)} ${ssrInterpolate(shippingAddress.value.lastName)}</p><p data-v-2b890dd2>${ssrInterpolate(shippingAddress.value.address)}</p><p data-v-2b890dd2>${ssrInterpolate(shippingAddress.value.postalCode)} ${ssrInterpolate(shippingAddress.value.city)}</p><p data-v-2b890dd2>${ssrInterpolate(shippingAddress.value.country)}</p></div><div class="border-b pb-4" data-v-2b890dd2><h3 class="font-semibold mb-2" data-v-2b890dd2>Zahlungsmethode</h3><p data-v-2b890dd2>${ssrInterpolate(paymentMethod.value === "credit_card" ? "Kreditkarte" : "PayPal")}</p></div><div class="border-b pb-4" data-v-2b890dd2><h3 class="font-semibold mb-2" data-v-2b890dd2>Bestellübersicht</h3><!--[-->`);
        ssrRenderList(__props.cart, (item) => {
          _push(`<div class="flex justify-between py-2" data-v-2b890dd2><span data-v-2b890dd2>${ssrInterpolate(item.name)} (${ssrInterpolate(item.quantity)})</span><span data-v-2b890dd2>${ssrInterpolate((parseFloat(item.price) * item.quantity).toFixed(2))} €</span></div>`);
        });
        _push(`<!--]--></div><div class="text-right" data-v-2b890dd2><p class="text-lg font-semibold" data-v-2b890dd2>Gesamtsumme: ${ssrInterpolate(cartTotal.value.toFixed(2))} €</p></div><div class="flex justify-between" data-v-2b890dd2><button class="btn border-2 border-gray-300" data-v-2b890dd2>Zurück</button><button class="btn bg-[#D8127D] text-white" data-v-2b890dd2>Bestellung abschließen</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props2, ctx) : void 0;
};
const CheckoutPage = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-2b890dd2"]]);
const checkout = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CheckoutPage
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = {
  __name: "order-confirmation",
  __ssrInlineRender: true,
  emits: ["navigate"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-6 py-12" }, _attrs))} data-v-8045f494><div class="max-w-2xl mx-auto text-center" data-v-8045f494><svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8045f494><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-8045f494></path></svg><h1 class="text-3xl font-bold mb-4" data-v-8045f494>Vielen Dank für Ihre Bestellung!</h1><p class="text-gray-600 mb-8" data-v-8045f494>Wir haben Ihnen eine Bestätigungs-E-Mail gesendet.</p><button class="btn bg-[#D8127D] text-white" data-v-8045f494> Zurück zur Startseite </button></div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/order-confirmation.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props2, ctx) : void 0;
};
const OrderConfirmationPage = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-8045f494"]]);
const orderConfirmation = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OrderConfirmationPage
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const currentPage = ref("Home");
    const selectedProduct = ref(null);
    const cart = ref([]);
    const isCartOpen = ref(false);
    const savedForLater = ref([]);
    const recentlyViewed = ref([]);
    const categories = ref([]);
    const readyToBuyProducts = ref([]);
    const customizableProducts = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    ref(1);
    const itemsPerPage = ref(12);
    const totalProducts = ref(0);
    computed(() => {
      return cart.value.reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0);
    });
    const cartItemCount = computed(() => {
      return cart.value.reduce((count, item) => count + item.quantity, 0);
    });
    const totalPages = computed(() => {
      return Math.ceil(totalProducts.value / itemsPerPage.value);
    });
    const handleNavigation = (page) => {
      currentPage.value = page;
      if (page !== "ProductDetail") {
        selectedProduct.value = null;
      }
    };
    const handleSelectProduct = (product) => {
      selectedProduct.value = product;
      currentPage.value = "ProductDetail";
      addToRecentlyViewed(product);
    };
    const addToCart = (product) => {
      cart.value.push({
        ...product,
        quantity: product.quantity || 1,
        selectedSize: product.selectedSize || null,
        selectedColor: product.selectedColor || null
      });
      localStorage.setItem("cart", JSON.stringify(cart.value));
    };
    const removeFromCart = (index2) => {
      cart.value.splice(index2, 1);
      localStorage.setItem("cart", JSON.stringify(cart.value));
    };
    const updateCartItemQuantity = ({ index: index2, quantity }) => {
      if (quantity < 1) return;
      cart.value[index2].quantity = quantity;
      localStorage.setItem("cart", JSON.stringify(cart.value));
    };
    const clearCart = () => {
      cart.value = [];
      localStorage.setItem("cart", JSON.stringify(cart.value));
    };
    const moveToSavedForLater = (index2) => {
      const item = cart.value[index2];
      savedForLater.value.push(item);
      removeFromCart(index2);
      localStorage.setItem("savedForLater", JSON.stringify(savedForLater.value));
    };
    const moveToCart = (index2) => {
      const item = savedForLater.value[index2];
      addToCart(item);
      savedForLater.value.splice(index2, 1);
      localStorage.setItem("savedForLater", JSON.stringify(savedForLater.value));
    };
    const addToRecentlyViewed = (product) => {
      const index2 = recentlyViewed.value.findIndex((p) => p.id === product.id);
      if (index2 > -1) {
        recentlyViewed.value.splice(index2, 1);
      }
      recentlyViewed.value.unshift(product);
      if (recentlyViewed.value.length > 4) {
        recentlyViewed.value.pop();
      }
      localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed.value));
    };
    const proceedToCheckout = () => {
      if (cart.value.length === 0) return;
      currentPage.value = "Checkout";
    };
    const handleCompleteOrder = async (orderData) => {
      try {
        console.log("Creating order:", orderData);
        clearCart();
        currentPage.value = "OrderConfirmation";
      } catch (error2) {
        console.error("Error creating order:", error2);
      }
    };
    const handleUpdateFilters = (filters) => {
      console.log("Filters updated:", filters);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-50 min-h-screen font-sans text-gray-800" }, _attrs))}>`);
      _push(ssrRenderComponent(NotificationBar, null, null, _parent));
      _push(ssrRenderComponent(Header, {
        cartItemCount: cartItemCount.value,
        onNavigate: handleNavigation,
        onToggleCart: ($event) => isCartOpen.value = !isCartOpen.value
      }, null, _parent));
      _push(`<main><div>`);
      if (currentPage.value === "Home") {
        _push(ssrRenderComponent(HomePage, {
          readyToBuyProducts: readyToBuyProducts.value,
          onNavigate: handleNavigation,
          onSelectProduct: handleSelectProduct
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentPage.value === "ReadyToBuy") {
        _push(ssrRenderComponent(ReadyToBuyPage, {
          categories: categories.value,
          readyToBuyProducts: readyToBuyProducts.value,
          isLoading: isLoading.value,
          totalPages: totalPages.value,
          onNavigate: handleNavigation,
          onSelectProduct: handleSelectProduct,
          onAddToCart: addToCart,
          onUpdateFilters: handleUpdateFilters
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentPage.value === "CustomizationCreator") {
        _push(ssrRenderComponent(CustomizationCreatorPage, {
          categories: categories.value,
          customizableProducts: customizableProducts.value,
          onNavigate: handleNavigation,
          onSelectProduct: handleSelectProduct
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentPage.value === "ProductDetail") {
        _push(`<div>`);
        if (selectedProduct.value) {
          _push(`<div>`);
          _push(ssrRenderComponent(ProductDetailPage, {
            selectedProduct: selectedProduct.value,
            onNavigate: handleNavigation,
            onAddToCart: addToCart
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="container mx-auto px-6 py-24 text-center"><h1 class="text-4xl font-bold mb-4">Produkt nicht gefunden</h1><p class="text-lg text-gray-600 mb-8">Das ausgewählte Produkt konnte nicht geladen werden.</p><button class="btn btn-primary">Zurück zur Startseite</button></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (currentPage.value === "Grossbestellung") {
        _push(ssrRenderComponent(GrossbestellungPage, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentPage.value === "Checkout") {
        _push(ssrRenderComponent(CheckoutPage, {
          cart: cart.value,
          onCompleteOrder: handleCompleteOrder
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentPage.value === "OrderConfirmation") {
        _push(ssrRenderComponent(OrderConfirmationPage, { onNavigate: handleNavigation }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentPage.value === "Creator") {
        _push(ssrRenderComponent(Creator, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!["Home", "ReadyToBuy", "CustomizationCreator", "Creator", "ProductDetail", "Grossbestellung", "Checkout", "OrderConfirmation"].includes(currentPage.value)) {
        _push(`<div><div class="container mx-auto px-6 py-24 text-center"><h1 class="text-4xl font-bold mb-4">${ssrInterpolate(currentPage.value)}</h1><p class="text-lg text-gray-600">Diese Seite befindet sich im Aufbau.</p><button class="btn btn-primary mt-8">Zurück zur Startseite</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></main>`);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(ssrRenderComponent(Cart, {
        isOpen: isCartOpen.value,
        cart: cart.value,
        savedForLater: savedForLater.value,
        recentlyViewed: recentlyViewed.value,
        onClose: ($event) => isCartOpen.value = false,
        onNavigate: handleNavigation,
        onUpdateCart: updateCartItemQuantity,
        onRemoveFromCart: removeFromCart,
        onMoveToSavedForLater: moveToSavedForLater,
        onMoveToCart: moveToCart,
        onAddToCart: addToCart,
        onProceedToCheckout: proceedToCheckout
      }, null, _parent));
      _push(`<div class="fixed bottom-5 right-5 z-50"><button class="bg-[#D8127D] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-[#b30f68] transition"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg></button></div>`);
      if (isLoading.value) {
        _push(`<div class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-4 border-[#D8127D] border-t-transparent mx-auto"></div><p class="mt-4 text-gray-600">Lade Produkte...</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (error.value) {
        _push(`<div class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"><div class="text-center p-8 bg-white rounded-lg shadow-lg"><svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><h3 class="text-lg font-semibold mb-2">Fehler beim Laden</h3><p class="text-gray-600 mb-4">${ssrInterpolate(error.value)}</p><button class="btn bg-[#D8127D] text-white"> Erneut versuchen </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props2, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props2 = __props;
    const _error = props2.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-CErwQQ4i.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-ZhwgdYfk.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props2, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props2, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props2, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    var _a;
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      (_a = nuxt.payload).error || (_a.error = createError(error));
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, useNuxtApp as a, useRuntimeConfig as b, nuxtLinkDefaults as c, useHead as d, entry$1 as default, navigateTo as n, resolveRouteObject as r, useRouter as u };
//# sourceMappingURL=server.mjs.map
