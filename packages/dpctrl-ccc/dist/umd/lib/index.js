(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dpctrlCCC = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var BaseDpCtrl = /** @class */ (function () {
        function BaseDpCtrl(dpcMgr) {
            this.needLoad = true;
            this.isLoaded = false;
            this.isLoading = false;
            this._isAsyncShow = false;
            this.isInited = false;
            this.isShowing = false;
            this.isShowed = false;
            this.needShow = false;
            this._dpcMgr = dpcMgr;
        }
        Object.defineProperty(BaseDpCtrl.prototype, "isAsyncShow", {
            get: function () {
                return this._isAsyncShow;
            },
            enumerable: true,
            configurable: true
        });
        BaseDpCtrl.prototype.onInit = function (initData) {
        };
        BaseDpCtrl.prototype.onShow = function (showData, endCb) {
            endCb && endCb();
        };
        BaseDpCtrl.prototype.onUpdate = function (updateData) {
        };
        BaseDpCtrl.prototype.getFace = function () {
            return this;
        };
        BaseDpCtrl.prototype.onHide = function () {
        };
        BaseDpCtrl.prototype.forceHide = function () {
        };
        BaseDpCtrl.prototype.getNode = function () {
            return this._node;
        };
        BaseDpCtrl.prototype.onDestroy = function (destroyRes) {
        };
        BaseDpCtrl.prototype.getRess = function () {
            return null;
        };
        return BaseDpCtrl;
    }());

    /**
     * DisplayControllerMgr
     * 显示控制类管理器基类
     */
    var DpcMgr = /** @class */ (function () {
        function DpcMgr() {
            /**
             * 单例缓存字典 key:ctrlKey,value:egf.IDpCtrl
             */
            this._sigCtrlCache = {};
            this._sigCtrlShowCfgMap = {};
            /**
             * 控制器类字典
             */
            this._ctrlClassMap = {};
        }
        Object.defineProperty(DpcMgr.prototype, "sigCtrlCache", {
            get: function () {
                return this._sigCtrlCache;
            },
            enumerable: true,
            configurable: true
        });
        DpcMgr.prototype.getCtrlClass = function (typeKey) {
            var clas = this._ctrlClassMap[typeKey];
            return clas;
        };
        DpcMgr.prototype.init = function (resLoadHandler) {
            if (!this._resLoadHandler) {
                this._resLoadHandler = resLoadHandler;
            }
        };
        DpcMgr.prototype.registTypes = function (classes) {
            if (classes) {
                if (typeof classes.length === "number" && classes.length) {
                    for (var i = 0; i < classes.length; i++) {
                        this.regist(classes[i]);
                    }
                }
                else {
                    for (var typeKey in classes) {
                        this.regist(classes[typeKey], typeKey);
                    }
                }
            }
        };
        DpcMgr.prototype.regist = function (ctrlClass, typeKey) {
            var classMap = this._ctrlClassMap;
            if (!ctrlClass.typeKey) {
                if (!typeKey) {
                    console.error("typeKey is null");
                    return;
                }
                else {
                    ctrlClass["typeKey"] = typeKey;
                }
            }
            if (classMap[ctrlClass.typeKey]) {
                console.error("type:" + ctrlClass.typeKey + " is exit");
            }
            else {
                classMap[ctrlClass.typeKey] = ctrlClass;
            }
        };
        DpcMgr.prototype.isRegisted = function (typeKey) {
            return !!this._ctrlClassMap[typeKey];
        };
        //单例操作
        DpcMgr.prototype.getSigDpcRess = function (typeKey) {
            var ctrlIns = this.getSigDpcIns(typeKey);
            if (ctrlIns) {
                return ctrlIns.getRess();
            }
            return null;
        };
        DpcMgr.prototype.loadSigDpc = function (loadCfg) {
            loadCfg = this._getCfg(loadCfg);
            var ctrlIns = this.getSigDpcIns(loadCfg);
            if (ctrlIns) {
                this.loadDpcByIns(ctrlIns, loadCfg);
            }
            return ctrlIns;
        };
        DpcMgr.prototype.getSigDpcIns = function (cfg) {
            cfg = this._getCfg(cfg);
            var sigCtrlCache = this._sigCtrlCache;
            if (!cfg.key)
                return null;
            var ctrlIns = sigCtrlCache[cfg.key];
            if (!ctrlIns) {
                ctrlIns = ctrlIns ? ctrlIns : this.insDpc(cfg);
                ctrlIns && (sigCtrlCache[cfg.key] = ctrlIns);
            }
            return ctrlIns;
        };
        DpcMgr.prototype.initSigDpc = function (cfg) {
            var ctrlIns;
            cfg = this._getCfg(cfg);
            ctrlIns = this.getSigDpcIns(cfg);
            if (ctrlIns && ctrlIns.isLoaded && !ctrlIns.isInited) {
                ctrlIns.onInit(cfg.onInitData);
                ctrlIns.isInited = true;
            }
            return ctrlIns;
        };
        DpcMgr.prototype.showDpc = function (showCfg) {
            var _this = this;
            showCfg = this._getCfg(showCfg);
            var ins = this.getSigDpcIns(showCfg);
            if (!ins) {
                console.error("\u6CA1\u6709\u6CE8\u518C:typeKey:" + showCfg.typeKey);
                return null;
            }
            var showTypeKey = ins.key;
            if (ins.isShowed) {
                return;
            }
            ins.needShow = true;
            var sigCtrlShowCfgMap = this._sigCtrlShowCfgMap;
            var oldShowCfg = sigCtrlShowCfgMap[ins.key];
            if (oldShowCfg) {
                oldShowCfg.onCancel && oldShowCfg.onCancel();
                Object.assign(oldShowCfg, showCfg);
            }
            else {
                sigCtrlShowCfgMap[ins.key] = showCfg;
            }
            if (ins.needLoad) {
                ins.isLoaded = false;
            }
            else if (!ins.isLoaded && !ins.isLoading) {
                ins.needLoad = true;
            }
            //需要加载
            if (ins.needLoad) {
                var preloadCfg = showCfg;
                preloadCfg.loadCb = function (loadedIns) {
                    var loadedShowCfg = sigCtrlShowCfgMap[showTypeKey];
                    if (loadedIns.needShow) {
                        _this.initDpcByIns(loadedIns, loadedShowCfg.onInitData);
                        _this.showDpcByIns(loadedIns, loadedShowCfg);
                    }
                    delete sigCtrlShowCfgMap[showTypeKey];
                };
                ins.needLoad = false;
                this._loadRess(ins, preloadCfg);
            }
            else {
                if (!ins.isInited) {
                    this.initDpcByIns(ins, showCfg.onInitData);
                }
                if (ins.isInited) {
                    this.showDpcByIns(ins, showCfg);
                }
            }
            return ins;
        };
        DpcMgr.prototype.updateDpc = function (key, updateData) {
            if (!key) {
                console.warn("!!!key is null");
                return;
            }
            var ctrlIns = this._sigCtrlCache[key];
            if (ctrlIns && ctrlIns.isInited) {
                ctrlIns.onUpdate(updateData);
            }
            else {
                console.warn(" updateDpc key:" + key + ",\u8BE5\u5B9E\u4F8B\u6CA1\u521D\u59CB\u5316");
            }
        };
        DpcMgr.prototype.hideDpc = function (key) {
            if (!key) {
                console.warn("!!!key is null");
                return;
            }
            var dpcIns = this._sigCtrlCache[key];
            if (!dpcIns) {
                console.warn(key + " \u6CA1\u5B9E\u4F8B\u5316");
                return;
            }
            this.hideDpcByIns(dpcIns);
        };
        DpcMgr.prototype.destroyDpc = function (key, destroyRes) {
            if (!key || key === "") {
                console.warn("!!!key is null");
                return;
            }
            var ins = this._sigCtrlCache[key];
            this.destroyDpcByIns(ins, destroyRes);
        };
        DpcMgr.prototype.isShowing = function (key) {
            if (!key) {
                console.warn("!!!key is null");
                return;
            }
            var ins = this._sigCtrlCache[key];
            if (ins) {
                return ins.isShowing;
            }
            else {
                return false;
            }
        };
        DpcMgr.prototype.isShowed = function (key) {
            if (!key) {
                console.warn("!!!key is null");
                return;
            }
            var ins = this._sigCtrlCache[key];
            if (ins) {
                return ins.isShowed;
            }
            else {
                return false;
            }
        };
        DpcMgr.prototype.isLoaded = function (key) {
            if (!key) {
                console.warn("!!!key is null");
                return;
            }
            var ins = this._sigCtrlCache[key];
            if (ins) {
                return ins.isLoaded;
            }
            else {
                return false;
            }
        };
        //基础操作函数
        DpcMgr.prototype.insDpc = function (keyCfg) {
            keyCfg = this._getCfg(keyCfg);
            var ctrlClass = this._ctrlClassMap[keyCfg.typeKey];
            if (!ctrlClass) {
                console.error("\u5B9E\u4F8B,\u8BF7\u5148\u6CE8\u518C\u7C7B:" + keyCfg.typeKey);
                return null;
            }
            var ins = new ctrlClass();
            ins.key = keyCfg.key;
            return ins;
        };
        DpcMgr.prototype.loadDpcByIns = function (dpcIns, loadCfg) {
            if (dpcIns) {
                if (dpcIns.needLoad) {
                    dpcIns.isLoaded = false;
                }
                else if (!dpcIns.isLoaded && !dpcIns.isLoading) {
                    dpcIns.needLoad = true;
                }
                if (dpcIns.needLoad) {
                    dpcIns.needLoad = false;
                    this._loadRess(dpcIns, loadCfg);
                }
            }
        };
        DpcMgr.prototype.initDpcByIns = function (dpcIns, initData) {
            if (dpcIns) {
                if (!dpcIns.isInited) {
                    dpcIns.isInited = true;
                    dpcIns.onInit && dpcIns.onInit(initData);
                }
            }
        };
        DpcMgr.prototype.showDpcByIns = function (dpcIns, showCfg) {
            if (dpcIns.needShow) {
                if (dpcIns.isAsyncShow) {
                    if (dpcIns.isShowing) {
                        dpcIns.forceHide();
                        dpcIns.isShowing = false;
                    }
                    dpcIns.isShowing = true;
                    dpcIns.onShow(showCfg.onShowData, function () {
                        dpcIns.isShowed = true;
                        dpcIns.isShowing = false;
                        showCfg.asyncShowedCb && showCfg.asyncShowedCb(dpcIns);
                    });
                }
                else {
                    dpcIns.onShow(showCfg.onShowData);
                    dpcIns.isShowed = true;
                }
                showCfg.showedCb && showCfg.showedCb(dpcIns);
            }
            dpcIns.needShow = false;
        };
        DpcMgr.prototype.hideDpcByIns = function (dpcIns) {
            if (!dpcIns)
                return;
            dpcIns.needShow = false;
            dpcIns.onHide();
            dpcIns.isShowing = false;
            dpcIns.isShowed = false;
        };
        DpcMgr.prototype.destroyDpcByIns = function (dpcIns, destroyRes) {
            if (!dpcIns)
                return;
            if (dpcIns.isInited) {
                dpcIns.isLoaded = false;
                dpcIns.isInited = false;
                dpcIns.needShow = false;
            }
            dpcIns.onDestroy(destroyRes);
        };
        DpcMgr.prototype._getCfg = function (cfg) {
            if (typeof cfg === "string") {
                cfg = { typeKey: cfg, key: cfg };
            }
            if (!cfg["key"]) {
                cfg["key"] = cfg["typeKey"];
            }
            return cfg;
        };
        DpcMgr.prototype._loadRess = function (ctrlIns, loadCfg) {
            if (ctrlIns) {
                if (!ctrlIns.isLoaded) {
                    if (isNaN(loadCfg["loadCount"])) {
                        loadCfg["loadCount"] = 0;
                    }
                    loadCfg["loadCount"]++;
                    var onComplete = function () {
                        loadCfg["loadCount"]--;
                        if (loadCfg["loadCount"] === 0) {
                            ctrlIns.isLoaded = true;
                            ctrlIns.isLoading = false;
                            loadCfg.loadCb(ctrlIns);
                        }
                    };
                    var onError = function () {
                        loadCfg["loadCount"]--;
                        if (loadCfg["loadCount"] === 0) {
                            ctrlIns.isLoaded = false;
                            ctrlIns.isLoading = false;
                            loadCfg.loadCb(null);
                        }
                    };
                    var customLoadViewIns = ctrlIns;
                    ctrlIns.isLoading = true;
                    ctrlIns.isLoaded = false;
                    if (customLoadViewIns.onLoad) {
                        customLoadViewIns.onLoad(onComplete, onError);
                    }
                    else if (this._resLoadHandler) {
                        var ress = ctrlIns.getRess ? ctrlIns.getRess() : null;
                        if (!ress || !ress.length) {
                            onComplete();
                            return;
                        }
                        this._resLoadHandler({
                            key: ctrlIns.key,
                            ress: ress,
                            complete: onComplete,
                            error: onError,
                            onLoadData: loadCfg.onLoadData
                        });
                    }
                    else {
                        ctrlIns.isLoaded = false;
                        ctrlIns.isLoading = false;
                        onError();
                        console.error("\u65E0\u6CD5\u5904\u7406\u52A0\u8F7D:" + ctrlIns.key);
                    }
                }
                else {
                    ctrlIns.isLoaded = true;
                    ctrlIns.isLoading = false;
                    loadCfg.loadCb && loadCfg.loadCb(ctrlIns);
                }
            }
        };
        return DpcMgr;
    }());

    var BaseNodeCtrl = /** @class */ (function (_super) {
        __extends(BaseNodeCtrl, _super);
        function BaseNodeCtrl() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseNodeCtrl.prototype.getNode = function () {
            return this.node;
        };
        BaseNodeCtrl.prototype.onShow = function (data, endCb) {
            if (this.node) {
                this.node.active = true;
            }
            _super.prototype.onShow.call(this);
        };
        BaseNodeCtrl.prototype.onHide = function () {
            if (this.node) {
                this.node.removeFromParent();
                this.node.active = false;
            }
            _super.prototype.onHide.call(this);
        };
        BaseNodeCtrl.prototype.forceHide = function () {
            this.node && (this.node.active = false);
            this.isShowed = false;
        };
        BaseNodeCtrl.prototype.onAdd = function (parent) {
            if (!this.node)
                return;
            parent.addChild(this.node);
        };
        BaseNodeCtrl.prototype.onRemove = function () {
            if (!this.node)
                return;
            this.node.removeFromParent();
        };
        BaseNodeCtrl.prototype.onResize = function () {
            if (this.node) ;
        };
        return BaseNodeCtrl;
    }(BaseDpCtrl));

    var Layer = /** @class */ (function (_super) {
        __extends(Layer, _super);
        function Layer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Layer.prototype.onInit = function (layerName, layerType, layerMgr) {
            this._layerType = layerType;
            this.name = layerName;
            this._layerMgr = layerMgr;
        };
        Layer.prototype.onDestroy = function () {
        };
        Object.defineProperty(Layer.prototype, "layerType", {
            get: function () {
                return this._layerType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layer.prototype, "layerName", {
            get: function () {
                return this.name;
            },
            enumerable: true,
            configurable: true
        });
        Layer.prototype.onAdd = function (root) {
            root.addChild(this);
            this.width = root.width;
            this.height = root.height;
        };
        Layer.prototype.onHide = function () {
            this.active = false;
        };
        Layer.prototype.onShow = function () {
            this.active = true;
        };
        Layer.prototype.onSpAdd = function (sp) {
            this.addChild(sp);
        };
        Layer.prototype.onNodeAdd = function (node) {
            this.addChild(node);
        };
        return Layer;
    }(cc.Node));

    exports.BaseNodeCtrl = BaseNodeCtrl;
    exports.Layer = Layer;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
window.dpctrlCCC?Object.assign({},window.dpctrlCCC):(window.dpctrlCCC = dpctrlCCC)
