var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/index.ts
var MAL_BASE = "https://api.myanimelist.net/v2";
var JIKAN_BASE = "https://api.jikan.moe/v4";
var ANISKIP_BASE = "https://api.aniskip.com/v2";
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
var cache = /* @__PURE__ */ new Map();
function getCached(key) {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.data;
  if (entry) cache.delete(key);
  return null;
}
__name(getCached, "getCached");
function setCache(key, data, ttlMs) {
  cache.set(key, { data, expires: Date.now() + ttlMs });
  if (cache.size > 500) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}
__name(setCache, "setCache");
function malHeaders(clientId) {
  return { "X-MAL-CLIENT-ID": clientId };
}
__name(malHeaders, "malHeaders");
async function malFetch(path, clientId) {
  const cacheKey = `mal:${path}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const res = await fetch(`${MAL_BASE}${path}`, { headers: malHeaders(clientId) });
  if (!res.ok) {
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 1e3));
      const retryRes = await fetch(`${MAL_BASE}${path}`, { headers: malHeaders(clientId) });
      if (!retryRes.ok) throw new Error(`MAL API error: ${retryRes.status}`);
      const retryData = await retryRes.json();
      setCache(cacheKey, retryData, 3e5);
      return retryData;
    }
    throw new Error(`MAL API error: ${res.status}`);
  }
  const data = await res.json();
  setCache(cacheKey, data, 3e5);
  return data;
}
__name(malFetch, "malFetch");
async function jikanFetch(path) {
  const cacheKey = `jikan:${path}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  await new Promise((r) => setTimeout(r, 350));
  const res = await fetch(`${JIKAN_BASE}${path}`);
  if (!res.ok) {
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 1e3));
      const retryRes = await fetch(`${JIKAN_BASE}${path}`);
      if (!retryRes.ok) throw new Error(`Jikan error: ${retryRes.status}`);
      const retryData = await retryRes.json();
      setCache(cacheKey, retryData, 3e5);
      return retryData;
    }
    throw new Error(`Jikan error: ${res.status}`);
  }
  const data = await res.json();
  setCache(cacheKey, data, 3e5);
  return data;
}
__name(jikanFetch, "jikanFetch");
var LIST_FIELDS = "id,title,main_picture,alternative_titles,mean,rank,popularity,num_episodes,media_type,status,genres,start_season,average_episode_duration,rating";
var DETAIL_FIELDS = "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,num_episodes,status,media_type,genres,studios,start_season,broadcast,source,average_episode_duration,rating,related_anime,recommendations,characters,statistics";
function malStatus(s) {
  return { currently_airing: "Airing", finished_airing: "Completed", not_yet_aired: "Upcoming" }[s] || s;
}
__name(malStatus, "malStatus");
function malMediaType(t) {
  return { tv: "TV", movie: "Movie", ova: "OVA", ona: "ONA", special: "Special", music: "Music" }[t] || t;
}
__name(malMediaType, "malMediaType");
function extractNodes(data) {
  return (data?.data || []).map((item) => {
    const node = item.node || {};
    if (item.ranking) node.rank = item.ranking.rank;
    return node;
  });
}
__name(extractNodes, "extractNodes");
function normalizeMal(item) {
  const mp = item.main_picture || {};
  const alt = item.alternative_titles || {};
  const season = item.start_season || {};
  const airedFrom = item.start_date;
  const airedTo = item.end_date;
  const bc = item.broadcast || null;
  const dur = item.average_episode_duration;
  return {
    mal_id: item.id,
    title: alt.en || item.title || "Unknown",
    title_english: alt.en || null,
    title_japanese: alt.ja || null,
    images: {
      jpg: { image_url: mp.medium || null, large_image_url: mp.large || mp.medium || null },
      webp: { image_url: mp.medium || null, large_image_url: mp.large || mp.medium || null }
    },
    type: item.media_type ? malMediaType(item.media_type) : null,
    episodes: item.num_episodes,
    status: item.status ? malStatus(item.status) : null,
    score: item.mean || null,
    scored_by: item.num_scoring_users || null,
    rank: item.rank || null,
    popularity: item.popularity || null,
    members: item.num_list_users || null,
    favorites: null,
    synopsis: item.synopsis || null,
    season: season.season ? String(season.season).charAt(0).toUpperCase() + String(season.season).slice(1) : null,
    year: season.year || null,
    aired: {
      from: airedFrom || null,
      to: airedTo || null,
      string: `${airedFrom || "?"} to ${airedTo || "?"}`
    },
    broadcast: bc ? { day: bc.day_of_the_week || null, time: bc.start_time || null } : null,
    studios: (item.studios || []).map((s) => ({ mal_id: s.id, name: s.name })),
    genres: (item.genres || []).map((g) => ({ mal_id: g.id, name: g.name })),
    themes: [],
    source: item.source || null,
    rating: item.rating || null,
    duration: dur ? `${Math.round(dur / 60)} min per ep` : null,
    trailer: null,
    relations: (item.related_anime || []).map((r) => {
      const rn = r.node || {};
      return {
        relation: r.relation_type || "",
        entry: [{ mal_id: rn.id, name: rn.title || "Unknown", type: malMediaType(rn.media_type || "") }]
      };
    })
  };
}
__name(normalizeMal, "normalizeMal");
function parseRecs(item) {
  const rawRecs = item.recommendations || [];
  return rawRecs.slice(0, 10).map((r) => {
    const rn = r.node || {};
    const rmp = rn.main_picture || {};
    return {
      entry: {
        mal_id: rn.id,
        title: rn.title || "Unknown",
        title_english: null,
        title_japanese: null,
        images: { jpg: { image_url: rmp.medium || null, large_image_url: rmp.large || rmp.medium || null }, webp: { image_url: rmp.medium || null, large_image_url: rmp.large || rmp.medium || null } },
        type: rn.media_type ? malMediaType(rn.media_type) : null,
        episodes: null,
        status: null,
        score: rn.mean || null,
        scored_by: null,
        rank: null,
        popularity: null,
        members: null,
        favorites: null,
        synopsis: null,
        season: null,
        year: null,
        aired: { from: null, to: null, string: "?" },
        broadcast: null,
        studios: [],
        genres: [],
        themes: [],
        source: null,
        rating: null,
        duration: null,
        trailer: null,
        relations: []
      }
    };
  });
}
__name(parseRecs, "parseRecs");
function parseChars(item) {
  const chars = item.characters || [];
  return chars.map((c) => {
    const ch = c.character || {};
    const chmp = ch.main_picture || {};
    const vas = c.voice_actors || [];
    return {
      mal_id: ch.id,
      name: ch.name || "Unknown",
      images: { jpg: { image_url: chmp.medium || null } },
      role: c.role === "main" ? "Main" : "Supporting",
      voice_actors: vas.map((va) => {
        const vp = va.person || {};
        const vpmp = vp.main_picture || {};
        return {
          person: { mal_id: vp.id, name: vp.name || "Unknown", images: { jpg: { image_url: vpmp.medium || null } } },
          language: va.language || "Japanese"
        };
      })
    };
  });
}
__name(parseChars, "parseChars");
function malPagination(data, limit, offset) {
  const hasNext = !!data?.paging?.next;
  const currentPage = Math.floor(offset / limit) + 1;
  return {
    last_visible_page: hasNext ? currentPage + 10 : currentPage,
    has_next_page: hasNext,
    current_page: currentPage,
    items: { count: 0, total: 0, per_page: limit }
  };
}
__name(malPagination, "malPagination");
function getSeason() {
  const now = /* @__PURE__ */ new Date();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  const seasons = ["winter", "spring", "summer", "fall"];
  const idx = Math.floor(m % 12 / 3);
  return { current: seasons[idx], year: y, next: seasons[(idx + 1) % 4], nextYear: (idx + 1) % 4 === 0 ? y + 1 : y };
}
__name(getSeason, "getSeason");
var src_default = {
  async fetch(request, env2) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: corsHeaders });
    }
    const url = new URL(request.url);
    const path = url.pathname;
    const malClientId = env2.MAL_CLIENT_ID || "";
    try {
      if (path === "/health") {
        return Response.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() }, { headers: corsHeaders });
      }
      if (path === "/anime/trending") {
        const data = await malFetch(`/anime/ranking?ranking_type=bypopularity&limit=20&fields=${LIST_FIELDS}`, malClientId);
        const items = extractNodes(data);
        return Response.json({ data: items.map(normalizeMal) }, { headers: corsHeaders });
      }
      if (path === "/anime/seasonal") {
        const { current, year } = getSeason();
        const data = await malFetch(`/anime/seasonal/${year}/${current}?limit=24&fields=${LIST_FIELDS}`, malClientId);
        const items = extractNodes(data);
        return Response.json({ data: items.map(normalizeMal) }, { headers: corsHeaders });
      }
      if (path === "/anime/upcoming") {
        const { next, nextYear } = getSeason();
        const data = await malFetch(`/anime/seasonal/${nextYear}/${next}?limit=12&fields=${LIST_FIELDS}`, malClientId);
        const items = extractNodes(data);
        return Response.json({ data: items.map(normalizeMal) }, { headers: corsHeaders });
      }
      if (path === "/anime/top") {
        const data = await malFetch(`/anime/ranking?ranking_type=all&limit=10&fields=${LIST_FIELDS}`, malClientId);
        const items = extractNodes(data);
        return Response.json({ data: items.map(normalizeMal) }, { headers: corsHeaders });
      }
      const animeDetailMatch = path.match(/^\/anime\/(\d+)$/);
      if (animeDetailMatch) {
        const id = animeDetailMatch[1];
        const cacheKey = `detail:${id}`;
        const cached = getCached(cacheKey);
        if (cached) return Response.json(cached, { headers: corsHeaders });
        const data = await malFetch(`/anime/${id}?fields=${DETAIL_FIELDS}`, malClientId);
        const normalized = normalizeMal(data);
        const chars = parseChars(data);
        normalized.characters = chars;
        setCache(cacheKey, normalized, 6e5);
        return Response.json(normalized, { headers: corsHeaders });
      }
      const episodesMatch = path.match(/^\/anime\/(\d+)\/episodes$/);
      if (episodesMatch) {
        const id = episodesMatch[1];
        let episodes = [];
        let totalEpisodes = null;
        try {
          const epData = await jikanFetch(`/anime/${id}/episodes`);
          episodes = (epData.data || []).map((ep) => ({
            ...ep,
            episode: ep.mal_id ?? ep.episode
          }));
        } catch {
        }
        try {
          const detailData = await malFetch(`/anime/${id}?fields=num_episodes`, malClientId);
          totalEpisodes = detailData.num_episodes;
        } catch {
        }
        if (!totalEpisodes) {
          try {
            const jikanDetail = await jikanFetch(`/anime/${id}`);
            totalEpisodes = jikanDetail.data?.episodes;
          } catch {
          }
        }
        if (totalEpisodes) {
          const existingNums = new Set(episodes.map((ep) => ep.episode));
          for (let i = 1; i <= totalEpisodes; i++) {
            if (!existingNums.has(i)) {
              episodes.push({
                mal_id: i,
                title: `Episode ${i}`,
                episode: i,
                aired: null,
                filler: false,
                recap: false,
                forum_url: null
              });
            }
          }
          episodes.sort((a, b) => a.episode - b.episode);
        }
        return Response.json({ data: episodes }, { headers: corsHeaders });
      }
      const skipTimesMatch = path.match(/^\/anime\/(\d+)\/episodes\/(\d+)\/skiptimes$/);
      if (skipTimesMatch) {
        const malId = skipTimesMatch[1];
        const epNum = skipTimesMatch[2];
        const cacheKey = `skiptimes:${malId}:${epNum}`;
        const cached = getCached(cacheKey);
        if (cached) return Response.json(cached, { headers: corsHeaders });
        const res = await fetch(`${ANISKIP_BASE}/skip-times/${malId}/${epNum}?types=op&types=ed`);
        const data = res.ok ? await res.json() : [];
        setCache(cacheKey, data, 36e5);
        return Response.json(data, { headers: corsHeaders });
      }
      const recommendationsMatch = path.match(/^\/anime\/(\d+)\/recommendations$/);
      if (recommendationsMatch) {
        const id = recommendationsMatch[1];
        const cacheKey = `recs:${id}`;
        const cached = getCached(cacheKey);
        if (cached) return Response.json(cached, { headers: corsHeaders });
        const data = await malFetch(`/anime/${id}?fields=recommendations`, malClientId);
        const recs = parseRecs(data);
        const result = { data: recs };
        setCache(cacheKey, result, 6e5);
        return Response.json(result, { headers: corsHeaders });
      }
      if (path === "/search") {
        const q = url.searchParams.get("q") || "";
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "25");
        const offset = (page - 1) * limit;
        const data = await malFetch(
          `/anime?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}&fields=${LIST_FIELDS}`,
          malClientId
        );
        const items = extractNodes(data);
        return Response.json({
          data: items.map(normalizeMal),
          pagination: malPagination(data, limit, offset)
        }, { headers: corsHeaders });
      }
      if (path === "/browse") {
        const params = url.searchParams;
        const page = parseInt(params.get("page") || "1");
        const limit = parseInt(params.get("limit") || "25");
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        qs.set("limit", String(limit));
        const type = params.get("type");
        if (type) qs.set("type", type === "TV" ? "tv" : type === "Movie" ? "movie" : type === "OVA" ? "ova" : type === "ONA" ? "ona" : type === "Special" ? "special" : type.toLowerCase());
        const status = params.get("status");
        if (status) {
          const sMap = { airing: "airing", completed: "complete", upcoming: "upcoming" };
          qs.set("status", sMap[status.toLowerCase()] || status);
        }
        const genres = params.get("genres");
        if (genres) qs.set("genres", genres);
        const score = params.get("score");
        if (score) qs.set("min_score", String(parseInt(score)));
        const sort = params.get("sort");
        if (sort) {
          const sortMap = { popularity: "popularity", score: "score", start_date: "start_date", title: "title" };
          qs.set("order_by", sortMap[sort.toLowerCase()] || "popularity");
          qs.set("sort", "desc");
        } else {
          qs.set("order_by", "popularity");
          qs.set("sort", "desc");
        }
        const season = params.get("season");
        const year = params.get("year");
        if (season && year) {
          qs.set("season", season.toLowerCase());
          qs.set("year", year);
        }
        const data = await jikanFetch(`/anime?${qs.toString()}`);
        return Response.json({
          data: data.data.map(normalizeMal),
          pagination: {
            last_visible_page: data.pagination?.last_visible_page || 1,
            has_next_page: data.pagination?.has_next_page || false,
            current_page: page,
            items: { count: data.data.length, total: data.pagination?.items ? data.pagination.items.total : 0, per_page: limit }
          }
        }, { headers: corsHeaders });
      }
      if (path.startsWith("/schedule/")) {
        const day = path.replace("/schedule/", "");
        const data = await jikanFetch(`/schedules?filter=${day}&limit=25`);
        return Response.json(data, { headers: corsHeaders });
      }
      if (path === "/genres") {
        const cached = getCached("genres:jikan");
        if (cached) return Response.json(cached, { headers: corsHeaders });
        const data = await jikanFetch("/genres/anime");
        const result = { data: (data.data || []).map((g) => ({ mal_id: g.mal_id, name: g.name, count: g.count || 0 })) };
        setCache("genres:jikan", result, 864e5);
        return Response.json(result, { headers: corsHeaders });
      }
      return Response.json({ error: true, code: "NOT_FOUND", message: "Route not found", retry: false }, { status: 404, headers: corsHeaders });
    } catch (err) {
      return Response.json(
        { error: true, code: "SERVER_ERROR", message: err instanceof Error ? err.message : "Internal error", retry: true },
        { status: 500, headers: corsHeaders }
      );
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-4aQci4/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-4aQci4/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
