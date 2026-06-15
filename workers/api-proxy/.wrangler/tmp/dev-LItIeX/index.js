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
var ANILIST_ENDPOINT = "https://graphql.anilist.co";
var ANILIST_AUTH_ENDPOINT = "https://anilist.co/api/v2/oauth";
var JIKAN_BASE = "https://api.jikan.moe/v4";
var ANISKIP_BASE = "https://api.aniskip.com/v2";
var GENRE_NAME_TO_ID = {
  Action: 1,
  Adventure: 2,
  Comedy: 4,
  Drama: 8,
  Fantasy: 10,
  Horror: 14,
  Mystery: 7,
  Romance: 22,
  "Sci-Fi": 24,
  "Slice of Life": 36,
  Sports: 30,
  Supernatural: 37,
  Thriller: 41,
  Ecchi: 9,
  Hentai: 12,
  Mecha: 18,
  Music: 19,
  "Psychological": 40,
  School: 23,
  "Seinen": 42,
  "Shoujo": 25,
  "Shounen": 27,
  "Space": 29
};
var GENRE_ID_TO_NAME = Object.fromEntries(
  Object.entries(GENRE_NAME_TO_ID).map(([name, id]) => [id.toString(), name])
);
var FORMAT_MAP = {
  TV: "TV",
  MOVIE: "Movie",
  OVA: "OVA",
  ONA: "ONA",
  SPECIAL: "Special",
  TV_SHORT: "TV"
};
var STATUS_MAP = {
  FINISHED: "Completed",
  RELEASING: "Airing",
  NOT_YET_RELEASED: "Upcoming",
  CANCELLED: "Completed",
  HIATUS: "Upcoming"
};
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
async function anilistQuery(query, variables, token, clientId) {
  const cacheKey = `anilist:${query}:${JSON.stringify(variables)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  if (clientId) headers["X-Client-ID"] = clientId;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables })
  });
  if (!res.ok) {
    throw new Error(`AniList API error: ${res.status}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || "AniList error");
  }
  setCache(cacheKey, json.data, 3e5);
  return json.data;
}
__name(anilistQuery, "anilistQuery");
async function jikanFetch(path) {
  const cacheKey = `jikan:${path}`;
  const cached = getCached(cacheKey);
  if (cached) return Response.json(cached, { headers: corsHeaders });
  const res = await fetch(`${JIKAN_BASE}${path}`);
  if (!res.ok) {
    return Response.json(
      { error: true, code: res.status === 429 ? "RATE_LIMITED" : "SERVER_ERROR", message: `Jikan API error: ${res.status}`, retry: res.status !== 404 },
      { status: res.status, headers: corsHeaders }
    );
  }
  const data = await res.json();
  setCache(cacheKey, data, 3e5);
  return Response.json(data, { headers: corsHeaders });
}
__name(jikanFetch, "jikanFetch");
function pad(n) {
  return n.toString().padStart(2, "0");
}
__name(pad, "pad");
function formatDate(d) {
  if (!d || !d.year) return null;
  if (d.month && d.day) return `${d.year}-${pad(d.month)}-${pad(d.day)}`;
  if (d.month) return `${d.year}-${pad(d.month)}-01`;
  return `${d.year}-01-01`;
}
__name(formatDate, "formatDate");
function formatDateString(d) {
  if (!d || !d.year) return "?";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = d.month ? months[d.month - 1] : "?";
  const day = d.day ? d.day : "?";
  return `${m} ${day}, ${d.year}`;
}
__name(formatDateString, "formatDateString");
function stripHtml(str) {
  if (!str) return null;
  return str.replace(/<[^>]*>/g, "").replace(/\\n/g, "\n").trim();
}
__name(stripHtml, "stripHtml");
function asDate(val) {
  if (!val || typeof val !== "object") return null;
  const r = val;
  return { year: r.year ?? null, month: r.month ?? null, day: r.day ?? null };
}
__name(asDate, "asDate");
function normalizeMedia(media) {
  const title2 = media.title;
  const coverImage = media.coverImage;
  const startDate = asDate(media.startDate);
  const endDate = asDate(media.endDate);
  const studios = media.studios;
  const genres = media.genres;
  const tags = media.tags;
  const trailer = media.trailer;
  const relations = media.relations;
  const recommendations = media.recommendations;
  const nextAiringEpisode = media.nextAiringEpisode;
  const characters = media.characters;
  const format = media.format;
  const episodes = media.episodes;
  const duration = media.duration;
  const averageScore = media.averageScore;
  const popularity = media.popularity;
  const favourites = media.favourites;
  const source = media.source;
  const idMal = media.idMal;
  const id = media.id;
  const malId = idMal || id;
  const normalized = {
    mal_id: malId,
    anilist_id: id,
    title: title2?.english || title2?.romaji || "Unknown",
    title_english: title2?.english || null,
    title_japanese: title2?.native || null,
    images: {
      jpg: { image_url: coverImage?.large || null, large_image_url: coverImage?.extraLarge || coverImage?.large || null },
      webp: { image_url: coverImage?.large || null, large_image_url: coverImage?.extraLarge || coverImage?.large || null }
    },
    type: format ? FORMAT_MAP[format] || format : null,
    episodes,
    status: nextAiringEpisode ? "Airing" : media.status ? STATUS_MAP[media.status] || media.status : null,
    score: averageScore ? Math.round(averageScore / 10 * 10) / 10 : null,
    scored_by: media.meanScore || null,
    rank: null,
    popularity,
    members: null,
    favourites: favourites || null,
    synopsis: stripHtml(media.description),
    season: media.season ? media.season.charAt(0) + media.season.slice(1).toLowerCase() : null,
    year: media.seasonYear,
    aired: {
      from: formatDate(startDate),
      to: formatDate(endDate),
      string: `${formatDateString(startDate)} to ${endDate?.year ? formatDateString(endDate) : "?"}`
    },
    broadcast: null,
    studios: studios ? studios.nodes?.map((s, i) => ({ mal_id: i + 1, name: s.name })) || [] : [],
    genres: genres?.map((g) => ({ mal_id: GENRE_NAME_TO_ID[g] || g.length, name: g })) || [],
    themes: tags?.slice(0, 5).map((t, i) => ({ mal_id: i + 1, name: t.name })) || [],
    source: source ? source.replace(/_/g, " ") : null,
    rating: null,
    duration: duration ? `${duration} min per ep` : null,
    trailer: trailer?.site === "youtube" ? { youtube_id: trailer.id, url: trailer.id ? `https://www.youtube.com/watch?v=${trailer.id}` : null } : null,
    relations: relations ? relations.edges?.map((e) => {
      const n = e.node;
      const nt = n.title;
      return {
        relation: e.relationType?.toLowerCase() || "",
        entry: [{ mal_id: n.idMal || n.id, name: nt?.english || nt?.romaji || "Unknown", type: FORMAT_MAP[n.format] || n.format || "unknown" }]
      };
    }) || [] : []
  };
  if (characters) {
    const edges = characters.edges;
    normalized.characters = edges?.map((e) => {
      const cn = e.node;
      const cName = cn.name;
      const cImage = cn.image;
      return {
        mal_id: cn.id,
        anilist_id: cn.id,
        name: cName?.full || "Unknown",
        images: { jpg: { image_url: cImage?.large || null } },
        role: e.role === "MAIN" ? "Main" : "Supporting",
        voice_actors: e.voiceActors?.map((va) => {
          const vaName = va.name;
          const vaImage = va.image;
          return {
            person: { mal_id: va.id, name: vaName?.full || "Unknown", images: { jpg: { image_url: vaImage?.large || null } } },
            language: va.language || "Japanese"
          };
        }) || []
      };
    }) || [];
  }
  if (recommendations) {
    const recEdges = recommendations.edges;
    normalized.recommendations = recEdges?.map((e) => {
      const rec = e.node.mediaRecommendation || e.node;
      const rt = rec.title;
      const rc = rec.coverImage;
      return {
        entry: {
          mal_id: rec.idMal || rec.id,
          title: rt?.english || rt?.romaji || "Unknown",
          images: { jpg: { image_url: rc?.large || null } },
          type: FORMAT_MAP[rec.format] || rec.format || null,
          score: rec.averageScore ? Math.round(rec.averageScore / 10 * 10) / 10 : null
        }
      };
    }) || [];
  }
  return normalized;
}
__name(normalizeMedia, "normalizeMedia");
function getSeasonDates() {
  const now = /* @__PURE__ */ new Date();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  if (m >= 1 && m <= 3) return { current: "WINTER", year: y, next: "SPRING", nextYear: y };
  if (m >= 4 && m <= 6) return { current: "SPRING", year: y, next: "SUMMER", nextYear: y };
  if (m >= 7 && m <= 9) return { current: "SUMMER", year: y, next: "FALL", nextYear: y };
  return { current: "FALL", year: y, next: "WINTER", nextYear: y + 1 };
}
__name(getSeasonDates, "getSeasonDates");
function getAniListSeason(season) {
  const map = { winter: "WINTER", spring: "SPRING", summer: "SUMMER", fall: "FALL" };
  return map[season.toLowerCase()] || "WINTER";
}
__name(getAniListSeason, "getAniListSeason");
var MEDIA_FRAGMENT = `
  id
  idMal
  title { romaji english native }
  coverImage { large extraLarge }
  bannerImage
  description
  season
  seasonYear
  format
  status
  episodes
  duration
  averageScore
  meanScore
  popularity
  favourites
  genres
  tags { name }
  source
  studios { nodes { name } }
  startDate { year month day }
  endDate { year month day }
  nextAiringEpisode { episode airingAt }
  relations {
    edges {
      relationType
      node { id idMal title { romaji english } format }
    }
  }
  trailer { id site thumbnail }
`.trim();
var src_default = {
  async fetch(request, env2) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: corsHeaders });
    }
    const url = new URL(request.url);
    const path = url.pathname;
    const clientId = env2.ANILIST_CLIENT_ID || "43709";
    try {
      if (path === "/health") {
        return Response.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() }, { headers: corsHeaders });
      }
      if (path === "/anime/trending") {
        const query = `query { Page(perPage: 20) { media(sort: TRENDING_DESC, type: ANIME) { ${MEDIA_FRAGMENT} } } }`;
        const data = await anilistQuery(query, {}, void 0, clientId);
        const page = data;
        const normalized = page.Page.media.map(normalizeMedia);
        return Response.json({ data: normalized }, { headers: corsHeaders });
      }
      if (path === "/anime/seasonal") {
        const { current, year } = getSeasonDates();
        const query = `query($season: MediaSeason, $year: Int) { Page(perPage: 24) { media(season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) { ${MEDIA_FRAGMENT} } } }`;
        const data = await anilistQuery(query, { season: current, year }, void 0, clientId);
        const page = data;
        const normalized = page.Page.media.map(normalizeMedia);
        return Response.json({ data: normalized }, { headers: corsHeaders });
      }
      if (path === "/anime/upcoming") {
        const { next, nextYear } = getSeasonDates();
        const query = `query($season: MediaSeason, $year: Int) { Page(perPage: 12) { media(season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) { ${MEDIA_FRAGMENT} } } }`;
        const data = await anilistQuery(query, { season: next, year: nextYear }, void 0, clientId);
        const page = data;
        const normalized = page.Page.media.map(normalizeMedia);
        return Response.json({ data: normalized }, { headers: corsHeaders });
      }
      if (path === "/anime/top") {
        const query = `query { Page(perPage: 10) { media(sort: SCORE_DESC, type: ANIME) { ${MEDIA_FRAGMENT} } } }`;
        const data = await anilistQuery(query, {}, void 0, clientId);
        const page = data;
        const normalized = page.Page.media.map(normalizeMedia);
        return Response.json({ data: normalized }, { headers: corsHeaders });
      }
      const animeDetailMatch = path.match(/^\/anime\/(\d+)$/);
      if (animeDetailMatch) {
        const id = parseInt(animeDetailMatch[1]);
        const cacheKey = `anime-detail:${id}`;
        const cached = getCached(cacheKey);
        if (cached) return Response.json(cached, { headers: corsHeaders });
        const query = `
          query($idMal: Int, $id: Int) {
            Media(idMal: $idMal, id: $id, type: ANIME) {
              ${MEDIA_FRAGMENT}
              characters(page: 1, perPage: 20) {
                edges {
                  role
                  node { id name { full } image { large } }
                  voiceActors { id name { full } image { large } language }
                }
              }
              recommendations(page: 1, perPage: 10) {
                edges {
                  node {
                    mediaRecommendation { id idMal title { romaji english } coverImage { large } format averageScore }
                  }
                }
              }
            }
          }`;
        let data;
        try {
          data = await anilistQuery(query, { idMal: id, id: void 0 }, void 0, clientId);
        } catch {
          data = await anilistQuery(query, { idMal: void 0, id }, void 0, clientId);
        }
        if (!data || !data.Media) {
          return Response.json(
            { error: true, code: "NOT_FOUND", message: "Anime not found", retry: false },
            { status: 404, headers: corsHeaders }
          );
        }
        const media = data.Media;
        const normalized = normalizeMedia(media);
        setCache(cacheKey, normalized, 6e5);
        return Response.json(normalized, { headers: corsHeaders });
      }
      const episodesMatch = path.match(/^\/anime\/(\d+)\/episodes$/);
      if (episodesMatch) {
        const id = episodesMatch[1];
        const res = await jikanFetch(`/anime/${id}/episodes`);
        const json = await res.json();
        if (json.data) {
          json.data = json.data.map((ep) => ({
            ...ep,
            episode: ep.mal_id ?? ep.episode
          }));
        }
        return Response.json(json, { headers: corsHeaders });
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
        const id = parseInt(recommendationsMatch[1]);
        const query = `
          query($idMal: Int, $id: Int) {
            Media(idMal: $idMal, id: $id, type: ANIME) {
              recommendations(page: 1, perPage: 10) {
                edges {
                  node {
                    mediaRecommendation { id idMal title { romaji english } coverImage { large } format averageScore }
                  }
                }
              }
            }
          }`;
        let data;
        try {
          data = await anilistQuery(query, { idMal: id, id: void 0 }, void 0, clientId);
        } catch {
          data = await anilistQuery(query, { idMal: void 0, id }, void 0, clientId);
        }
        if (!data?.Media) {
          return Response.json({ data: [] }, { headers: corsHeaders });
        }
        const recs = data.Media.recommendations;
        const edges = recs?.edges;
        const recommended = edges?.map((e) => {
          const rec = e.node?.mediaRecommendation;
          if (!rec) return null;
          const rt = rec.title;
          const rc = rec.coverImage;
          const entryMalId = rec.idMal || rec.id;
          const entryTitle = rt?.english || rt?.romaji || "Unknown";
          return {
            entry: {
              mal_id: entryMalId,
              anilist_id: rec.id,
              title: entryTitle,
              title_english: rt?.english || null,
              title_japanese: rt?.romaji || null,
              images: { jpg: { image_url: rc?.large || null, large_image_url: rc?.large || null }, webp: { image_url: rc?.large || null, large_image_url: rc?.large || null } },
              type: rec.format ? FORMAT_MAP[rec.format] || rec.format : null,
              episodes: null,
              status: null,
              score: rec.averageScore ? Math.round(rec.averageScore / 10 * 10) / 10 : null,
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
        }).filter(Boolean) || [];
        return Response.json({ data: recommended }, { headers: corsHeaders });
      }
      if (path === "/search") {
        const q = url.searchParams.get("q") || "";
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "25");
        const query = `
          query($q: String, $page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
              pageInfo { currentPage hasNextPage lastPage perPage total }
              media(search: $q, type: ANIME) { ${MEDIA_FRAGMENT} }
            }
          }`;
        const data = await anilistQuery(query, { q, page, perPage: limit }, void 0, clientId);
        const d = data;
        const pageInfo = d.Page.pageInfo;
        return Response.json({
          data: d.Page.media.map(normalizeMedia),
          pagination: {
            last_visible_page: pageInfo.lastPage || 1,
            has_next_page: pageInfo.hasNextPage || false,
            current_page: pageInfo.currentPage || 1,
            items: { count: d.Page.media.length, total: pageInfo.total || 0, per_page: pageInfo.perPage || limit }
          }
        }, { headers: corsHeaders });
      }
      if (path === "/browse") {
        const params = url.searchParams;
        const page = parseInt(params.get("page") || "1");
        const limit = parseInt(params.get("limit") || "25");
        const variables = { page, perPage: limit, type: "ANIME" };
        const type = params.get("type");
        if (type) variables.format_in = [type === "Movie" ? "MOVIE" : type === "TV" ? "TV" : type === "OVA" ? "OVA" : type === "ONA" ? "ONA" : type === "Special" ? "SPECIAL" : type];
        const status = params.get("status");
        if (status) {
          const sMap = { airing: "RELEASING", completed: "FINISHED", upcoming: "NOT_YET_RELEASED" };
          variables.status = sMap[status.toLowerCase()] || status;
        }
        const genres = params.get("genres");
        if (genres) {
          const genreNames = genres.split(",").filter(Boolean).map((id) => GENRE_ID_TO_NAME[id]).filter(Boolean);
          if (genreNames.length > 0) variables.genre_in = genreNames;
        }
        const score = params.get("score");
        if (score) variables.averageScore_greater = parseInt(score) * 10;
        const sort = params.get("sort");
        if (sort) {
          const sortMap = { popularity: "POPULARITY_DESC", score: "SCORE_DESC", start_date: "START_DATE_DESC", title: "TITLE_ROMAJI" };
          variables.sort = [sortMap[sort.toLowerCase()] || "POPULARITY_DESC"];
        } else {
          variables.sort = ["POPULARITY_DESC"];
        }
        const season = params.get("season");
        if (season) variables.season = getAniListSeason(season);
        const year = params.get("year");
        if (year) variables.seasonYear = parseInt(year);
        const query = `
          query($page: Int, $perPage: Int, $type: MediaType, $format_in: [MediaFormat], $status: MediaStatus, $genre_in: [String], $averageScore_greater: Int, $sort: [MediaSort], $season: MediaSeason, $seasonYear: Int) {
            Page(page: $page, perPage: $perPage) {
              pageInfo { currentPage hasNextPage lastPage perPage total }
              media(format_in: $format_in, status: $status, genre_in: $genre_in, averageScore_greater: $averageScore_greater, sort: $sort, season: $season, seasonYear: $seasonYear, type: $type) { ${MEDIA_FRAGMENT} }
            }
          }`;
        const data = await anilistQuery(query, variables, void 0, clientId);
        const d = data;
        const pageInfo = d.Page.pageInfo;
        return Response.json({
          data: d.Page.media.map(normalizeMedia),
          pagination: {
            last_visible_page: pageInfo.lastPage || 1,
            has_next_page: pageInfo.hasNextPage || false,
            current_page: pageInfo.currentPage || 1,
            items: { count: d.Page.media.length, total: pageInfo.total || 0, per_page: pageInfo.perPage || limit }
          }
        }, { headers: corsHeaders });
      }
      if (path.startsWith("/schedule/")) {
        const day = path.replace("/schedule/", "");
        return await jikanFetch(`/schedules?filter=${day}&limit=25`);
      }
      if (path === "/genres") {
        const cached = getCached("genres:anilist");
        if (cached) return Response.json(cached, { headers: corsHeaders });
        const query = `query { GenreCollection }`;
        const data = await anilistQuery(query, {}, void 0, clientId);
        const d = data;
        const genresData = {
          data: d.GenreCollection.filter((g) => GENRE_NAME_TO_ID[g]).map((g) => ({ mal_id: GENRE_NAME_TO_ID[g], name: g, count: 0 }))
        };
        setCache("genres:anilist", genresData, 864e5);
        return Response.json(genresData, { headers: corsHeaders });
      }
      if (path === "/auth/anilist/login") {
        const state = crypto.randomUUID();
        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: `${url.origin}/auth/anilist/callback`,
          response_type: "code",
          state
        });
        const authUrl = `https://anilist.co/api/v2/oauth/authorize?${params}`;
        return Response.json({ authUrl, state }, { headers: corsHeaders });
      }
      if (path === "/auth/anilist/callback") {
        const code = url.searchParams.get("code");
        if (!code) {
          return Response.json({ error: true, code: "AUTH_ERROR", message: "No authorization code provided", retry: false }, { status: 400, headers: corsHeaders });
        }
        const tokenRes = await fetch(`${ANILIST_AUTH_ENDPOINT}/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: clientId,
            client_secret: env2.ANILIST_CLIENT_SECRET || "",
            redirect_uri: `${url.origin}/auth/anilist/callback`,
            code
          })
        });
        if (!tokenRes.ok) {
          return Response.json({ error: true, code: "AUTH_ERROR", message: "Failed to exchange authorization code", retry: true }, { status: 400, headers: corsHeaders });
        }
        const tokenData = await tokenRes.json();
        return Response.json(tokenData, { headers: corsHeaders });
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

// .wrangler/tmp/bundle-uWYOyT/middleware-insertion-facade.js
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

// .wrangler/tmp/bundle-uWYOyT/middleware-loader.entry.ts
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
