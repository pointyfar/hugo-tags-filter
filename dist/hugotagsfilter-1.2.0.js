(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @name 'Hugo Tags Filter'
 * @version 1.0.1
 * @license MIT  
 * @author PointyFar 
 */

var HugoTagsFilter = function () {
  function HugoTagsFilter(config) {
    _classCallCheck(this, HugoTagsFilter);

    var defaultFilters = [{
      name: 'tag',
      prefix: 'tft-',
      buttonClass: 'tft-button',
      allSelector: '#tfSelectAllTags',
      attrName: 'data-tags',
      countPrefix: 'ctft-'
    }, {
      name: 'section',
      prefix: 'tfs-',
      buttonClass: 'tfs-button',
      allSelector: '#tfSelectAllSections',
      attrName: 'data-section',
      countPrefix: 'ctft-'
    }];

    this.FILTERS = config && config.filters ? config.filters : defaultFilters;
    this.showItemClass = config && config.showItemClass ? config.showItemClass : "tf-show";
    this.activeButtonClass = config && config.activeButtonClass ? config.activeButtonClass : "active";
    this.filterItemClass = config && config.filterItemClass ? config.filterItemClass : "tf-filter-item";
    this.counterSelector = config && config.counterSelector ? config.counterSelector : "selectedItemCount";

    this.populateCount = config && config.populateCount ? config.populateCount : false;
    this.setDisabledButtonClass = config && config.setDisabledButtonClass ? config.setDisabledButtonClass : false;

    this.filterItems = document.getElementsByClassName(this.filterItemClass);
    this.selectedItemCount = 0;

    this.filterValues = {};

    for (var i = 0; i < this.FILTERS.length; i++) {
      this.FILTERS[i]['buttonTotal'] = document.getElementsByClassName(this.FILTERS[i]['buttonClass']).length;
      this.FILTERS[i]['selected'] = [];
      this.FILTERS[i]['values'] = [];
      var fv = document.getElementsByClassName(this.FILTERS[i]['buttonClass']);

      /**      
      * Build index of all filter values and their counts      
      */
      this.filterValues[this.FILTERS[i]['name']] = [];
      for (var j = 0; j < fv.length; j++) {
        var v = fv[j].id.replace(this.FILTERS[i]["prefix"], '');
        this.filterValues[this.FILTERS[i]['name']][v] = { count: 0, selected: 0 };
      }
    }
    this.showCheck(this.FILTERS[0]['name'], true);
  }

  _createClass(HugoTagsFilter, [{
    key: 'initFilterCount',
    value: function initFilterCount(fvc, isInitial) {

      /**    
       * Initialise count = selected
       */
      if (isInitial) {
        for (var k in fvc) {
          for (var x = 0; x < this.filterItems.length; x++) {
            var attrs = this.getAttrs(k, this.filterItems[x]);
            for (var l = 0; l < attrs.length; l++) {
              fvc[k][attrs[l]].count++;
              fvc[k][attrs[l]].selected++;
            }
          }
        }
      } else {
        var showing = document.getElementsByClassName(this.showItemClass);
        for (var k in fvc) {
          for (var k2 in fvc[k]) {
            fvc[k][k2].selected = 0;
          }
        }
        for (var l = 0; l < showing.length; l++) {
          for (k in fvc) {
            var attrs = this.getAttrs(k, showing[l]);
            for (var m = 0; m < attrs.length; m++) {
              fvc[k][attrs[m]].selected++;
            }
          }
        }
      }

      console.log(fvc);
      return fvc;
    }
  }, {
    key: 'populateCounters',
    value: function populateCounters(fvc) {

      if (this.populateCount) {
        for (var i = 0; i < this.FILTERS.length; i++) {
          var fname = this.FILTERS[i]['name'];
          var cp = this.FILTERS[i]['countPrefix'];
          var sp = this.FILTERS[i]['selectedPrefix'];

          if (cp || sp) {
            for (var k in fvc[fname]) {
              if (cp) {
                var cel = document.getElementById('' + cp + k);
                cel.textContent = fvc[fname][k].count;
              }
              if (sp) {
                var sel = document.getElementById('' + sp + k);
                sel.textContent = fvc[fname][k].selected;
                if (this.setDisabledButtonClass) {
                  if (sel.textContent == 0) {
                    this.addClassIfMissing(document.getElementById(this.FILTERS[i]['prefix'] + k), this.setDisabledButtonClass);
                  } else {
                    this.delClassIfPresent(document.getElementById(this.FILTERS[i]['prefix'] + k), this.setDisabledButtonClass);
                  }
                }
              }
            }
          }
        }
      }
    }

    /**  
     * getAttrs - returns an array of data-attr attributes of an element elem
     */

  }, {
    key: 'getAttrs',
    value: function getAttrs(attr, elem) {
      return elem.getAttribute('data-' + attr).split(" ").filter(function (el) {
        return el.length > 0;
      });
    }
  }, {
    key: 'showAll',
    value: function showAll(filter) {
      for (var i = 0; i < this.FILTERS.length; i++) {
        if (filter) {
          if (this.FILTERS[i]['name'] === filter) {
            this.FILTERS[i]['selected'] = [];
          }
        } else {
          this.FILTERS[i]['selected'] = [];
        }
      }
      this.showCheck(filter);
    }
  }, {
    key: 'checkFilter',
    value: function checkFilter(tag, tagType) {

      /* Selects clicked button.*/
      var selectedBtn = document.querySelector('#' + tagType + tag);

      for (var i = 0; i < this.FILTERS.length; i++) {
        if (this.FILTERS[i]['prefix'] === tagType) {
          if (this.FILTERS[i]['selected'].indexOf(tag) >= 0) {
            /* already selected, deselect tag */
            this.FILTERS[i]['selected'].splice(tag, 1);
            this.delClassIfPresent(selectedBtn, this.activeButtonClass);
          } else {
            /* add tag to selected list */
            this.FILTERS[i]['selected'].push(tag);
            this.addClassIfMissing(selectedBtn, this.activeButtonClass);
          }
          this.delClassIfPresent(document.querySelector(this.FILTERS[i]['allSelector']), this.activeButtonClass);
          this.showCheck(this.FILTERS[i]['name']);
        }
      }
    }

    /**
    * showCheck - Applies "show" class to items containing selected tags
    */

  }, {
    key: 'showCheck',
    value: function showCheck(filter, isInitial) {

      /* If no tags/licenses selected, or all tags selected, SHOW ALL and DESELECT ALL BUTTONS. */
      for (var i = 0; i < this.FILTERS.length; i++) {
        if (this.FILTERS[i]['name'] === filter) {
          if (this.FILTERS[i]['selected'].length === 0 || this.FILTERS[i]['selected'].length === this.FILTERS[i]['buttonTotal']) {
            var iBtns = document.getElementsByClassName(this.FILTERS[i]['buttonClass']);
            for (var j = 0; j < iBtns.length; j++) {
              this.delClassIfPresent(iBtns[j], this.activeButtonClass);
            }
            this.addClassIfMissing(document.querySelector(this.FILTERS[i]['allSelector']), this.activeButtonClass);
          }
        }
      }

      this.selectedItemCount = 0;

      for (var i = 0; i < this.filterItems.length; i++) {
        /* First remove "show" class */
        this.delClassIfPresent(this.filterItems[i], this.showItemClass);

        var visibility = 0;
        /* show item only if visibility is true for all filters */
        for (var j = 0; j < this.FILTERS.length; j++) {
          if (this.checkVisibility(this.FILTERS[j]['selected'], this.filterItems[i].getAttribute(this.FILTERS[j]['attrName']))) {
            visibility++;
          }
        }
        /* Then check if "show" class should be applied */
        if (visibility === this.FILTERS.length) {
          if (!this.filterItems[i].classList.contains(this.showItemClass)) {
            this.selectedItemCount++;
            this.addClassIfMissing(this.filterItems[i], this.showItemClass);
          }
        }
      }

      if (document.getElementById(this.counterSelector)) {
        document.getElementById(this.counterSelector).textContent = '' + this.selectedItemCount;
      }

      this.checkButtonCounts(isInitial);
    }

    /**  
     * checkDisabledButtons - For each tag/section/whatever: 
     *    a. count items with tag 
     *    b. count items with tag that are hidden 
     *    if a == b : mark button for that tag as disabled;
     */

  }, {
    key: 'checkButtonCounts',
    value: function checkButtonCounts(isInitial) {
      this.filterValues = this.initFilterCount(this.filterValues, isInitial);
      this.populateCounters(this.filterValues);
    }

    /**
    * checkVisibility - Tests if attribute is included in list.
    */

  }, {
    key: 'checkVisibility',
    value: function checkVisibility(list, dataAttr) {
      /* Returns TRUE if list is empty or attribute is in list */
      if (list.length > 0) {
        for (var v = 0; v < list.length; v++) {
          if (dataAttr.indexOf(list[v]) >= 0) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: 'addClassIfMissing',
    value: function addClassIfMissing(el, cn) {
      if (!el.classList.contains(cn)) {
        el.classList.add(cn);
      }
    }
  }, {
    key: 'delClassIfPresent',
    value: function delClassIfPresent(el, cn) {
      if (el.classList.contains(cn)) {
        el.classList.remove(cn);
      }
    }
  }]);

  return HugoTagsFilter;
}();

window['HugoTagsFilter'] = HugoTagsFilter;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaHVnb3RhZ3NmaWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQTs7Ozs7OztJQU9NLGM7QUFDSiwwQkFBWSxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLFFBQUksaUJBQWlCLENBQ25CO0FBQ0UsWUFBTSxLQURSO0FBRUUsY0FBUSxNQUZWO0FBR0UsbUJBQWEsWUFIZjtBQUlFLG1CQUFhLGtCQUpmO0FBS0UsZ0JBQVUsV0FMWjtBQU1FLG1CQUFhO0FBTmYsS0FEbUIsRUFTbkI7QUFDRSxZQUFNLFNBRFI7QUFFRSxjQUFRLE1BRlY7QUFHRSxtQkFBYSxZQUhmO0FBSUUsbUJBQWEsc0JBSmY7QUFLRSxnQkFBVSxjQUxaO0FBTUUsbUJBQWE7QUFOZixLQVRtQixDQUFyQjs7QUFtQkEsU0FBSyxPQUFMLEdBQWdCLFVBQVUsT0FBTyxPQUFsQixHQUE2QixPQUFPLE9BQXBDLEdBQThDLGNBQTdEO0FBQ0EsU0FBSyxhQUFMLEdBQXNCLFVBQVUsT0FBTyxhQUFsQixHQUFtQyxPQUFPLGFBQTFDLEdBQTBELFNBQS9FO0FBQ0EsU0FBSyxpQkFBTCxHQUEwQixVQUFVLE9BQU8saUJBQWxCLEdBQXVDLE9BQU8saUJBQTlDLEdBQWtFLFFBQTNGO0FBQ0EsU0FBSyxlQUFMLEdBQXdCLFVBQVUsT0FBTyxlQUFsQixHQUFxQyxPQUFPLGVBQTVDLEdBQThELGdCQUFyRjtBQUNBLFNBQUssZUFBTCxHQUF3QixVQUFVLE9BQU8sZUFBbEIsR0FBcUMsT0FBTyxlQUE1QyxHQUE4RCxtQkFBckY7O0FBRUEsU0FBSyxhQUFMLEdBQXNCLFVBQVUsT0FBTyxhQUFsQixHQUFtQyxPQUFPLGFBQTFDLEdBQTBELEtBQS9FO0FBQ0EsU0FBSyxzQkFBTCxHQUErQixVQUFVLE9BQU8sc0JBQWxCLEdBQTRDLE9BQU8sc0JBQW5ELEdBQTRFLEtBQTFHOztBQUdBLFNBQUssV0FBTCxHQUFt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dXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBAbmFtZSAnSHVnbyBUYWdzIEZpbHRlcidcbiAqIEB2ZXJzaW9uIDEuMC4xXG4gKiBAbGljZW5zZSBNSVQgIFxuICogQGF1dGhvciBQb2ludHlGYXIgXG4gKi8gXG5cbmNsYXNzIEh1Z29UYWdzRmlsdGVyIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgdmFyIGRlZmF1bHRGaWx0ZXJzID0gW1xuICAgICAge1xuICAgICAgICBuYW1lOiAndGFnJyxcbiAgICAgICAgcHJlZml4OiAndGZ0LScsXG4gICAgICAgIGJ1dHRvbkNsYXNzOiAndGZ0LWJ1dHRvbicsXG4gICAgICAgIGFsbFNlbGVjdG9yOiAnI3RmU2VsZWN0QWxsVGFncycsXG4gICAgICAgIGF0dHJOYW1lOiAnZGF0YS10YWdzJyxcbiAgICAgICAgY291bnRQcmVmaXg6ICdjdGZ0LSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdzZWN0aW9uJyxcbiAgICAgICAgcHJlZml4OiAndGZzLScsXG4gICAgICAgIGJ1dHRvbkNsYXNzOiAndGZzLWJ1dHRvbicsXG4gICAgICAgIGFsbFNlbGVjdG9yOiAnI3RmU2VsZWN0QWxsU2VjdGlvbnMnLFxuICAgICAgICBhdHRyTmFtZTogJ2RhdGEtc2VjdGlvbicsXG4gICAgICAgIGNvdW50UHJlZml4OiAnY3RmdC0nXG4gICAgICB9XG4gICAgXVxuICAgIFxuICAgIHRoaXMuRklMVEVSUyA9IChjb25maWcgJiYgY29uZmlnLmZpbHRlcnMpID8gY29uZmlnLmZpbHRlcnMgOiBkZWZhdWx0RmlsdGVycztcbiAgICB0aGlzLnNob3dJdGVtQ2xhc3MgPSAoY29uZmlnICYmIGNvbmZpZy5zaG93SXRlbUNsYXNzKSA/IGNvbmZpZy5zaG93SXRlbUNsYXNzIDogXCJ0Zi1zaG93XCI7XG4gICAgdGhpcy5hY3RpdmVCdXR0b25DbGFzcyA9IChjb25maWcgJiYgY29uZmlnLmFjdGl2ZUJ1dHRvbkNsYXNzKSA/IGNvbmZpZy5hY3RpdmVCdXR0b25DbGFzcyA6IFwiYWN0aXZlXCI7XG4gICAgdGhpcy5maWx0ZXJJdGVtQ2xhc3MgPSAoY29uZmlnICYmIGNvbmZpZy5maWx0ZXJJdGVtQ2xhc3MpID8gY29uZmlnLmZpbHRlckl0ZW1DbGFzcyA6IFwidGYtZmlsdGVyLWl0ZW1cIjtcbiAgICB0aGlzLmNvdW50ZXJTZWxlY3RvciA9IChjb25maWcgJiYgY29uZmlnLmNvdW50ZXJTZWxlY3RvcikgPyBjb25maWcuY291bnRlclNlbGVjdG9yIDogXCJzZWxlY3RlZEl0ZW1Db3VudFwiO1xuICAgIFxuICAgIHRoaXMucG9wdWxhdGVDb3VudCA9IChjb25maWcgJiYgY29uZmlnLnBvcHVsYXRlQ291bnQpID8gY29uZmlnLnBvcHVsYXRlQ291bnQgOiBmYWxzZTtcbiAgICB0aGlzLnNldERpc2FibGVkQnV0dG9uQ2xhc3MgPSAoY29uZmlnICYmIGNvbmZpZy5zZXREaXNhYmxlZEJ1dHRvbkNsYXNzKSA/IGNvbmZpZy5zZXREaXNhYmxlZEJ1dHRvbkNsYXNzIDogZmFsc2U7XG4gICAgXG4gICAgXG4gICAgdGhpcy5maWx0ZXJJdGVtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5maWx0ZXJJdGVtQ2xhc3MpO1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtQ291bnQgPSAwO1xuICAgIFxuICAgIHRoaXMuZmlsdGVyVmFsdWVzID0ge307XG4gICAgXG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuRklMVEVSU1tpXVsnYnV0dG9uVG90YWwnXSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5GSUxURVJTW2ldWydidXR0b25DbGFzcyddKS5sZW5ndGg7XG4gICAgICB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10gPSBbXTtcbiAgICAgIHRoaXMuRklMVEVSU1tpXVsndmFsdWVzJ10gPSBbXTtcbiAgICAgIHZhciBmdiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5GSUxURVJTW2ldWydidXR0b25DbGFzcyddKTtcbiAgICAgIFxuICAgICAgLyoqICAgICAgXG4gICAgICAqIEJ1aWxkIGluZGV4IG9mIGFsbCBmaWx0ZXIgdmFsdWVzIGFuZCB0aGVpciBjb3VudHMgICAgICBcbiAgICAgICovICAgICAgIFxuICAgICAgdGhpcy5maWx0ZXJWYWx1ZXNbdGhpcy5GSUxURVJTW2ldWyduYW1lJ11dID0gW107IFxuICAgICAgZm9yKCB2YXIgaiA9IDA7IGogPCBmdi5sZW5ndGg7IGorKyApe1xuICAgICAgICB2YXIgdiA9IGZ2W2pdLmlkLnJlcGxhY2UodGhpcy5GSUxURVJTW2ldW1wicHJlZml4XCJdLCAnJyk7XG4gICAgICAgIHRoaXMuZmlsdGVyVmFsdWVzW3RoaXMuRklMVEVSU1tpXVsnbmFtZSddXVt2XSA9IHtjb3VudDowLCBzZWxlY3RlZDowfTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zaG93Q2hlY2sodGhpcy5GSUxURVJTWzBdWyduYW1lJ10sIHRydWUpO1xuXG5cbiAgfVxuICBcbiAgaW5pdEZpbHRlckNvdW50KGZ2YywgaXNJbml0aWFsKXtcbiAgICBcbiAgICAvKiogICAgXG4gICAgICogSW5pdGlhbGlzZSBjb3VudCA9IHNlbGVjdGVkXG4gICAgICovICAgICBcbiAgICBpZihpc0luaXRpYWwpIHtcbiAgICAgIGZvciggdmFyIGsgaW4gZnZjICkge1xuICAgICAgICBmb3IoIHZhciB4ID0gMDsgeCA8IHRoaXMuZmlsdGVySXRlbXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLmdldEF0dHJzKGssIHRoaXMuZmlsdGVySXRlbXNbeF0pO1xuICAgICAgICAgIGZvcih2YXIgbCA9IDA7IGwgPGF0dHJzLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICBmdmNba11bYXR0cnNbbF1dLmNvdW50Kys7XG4gICAgICAgICAgICBmdmNba11bYXR0cnNbbF1dLnNlbGVjdGVkKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzaG93aW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnNob3dJdGVtQ2xhc3MpO1xuICAgICAgZm9yKCB2YXIgayBpbiBmdmMgKSB7XG4gICAgICAgIGZvciggdmFyIGsyIGluIGZ2Y1trXSApe1xuICAgICAgICAgIGZ2Y1trXVtrMl0uc2VsZWN0ZWQgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IodmFyIGwgPSAwOyBsIDwgc2hvd2luZy5sZW5ndGg7IGwrKykge1xuICAgICAgICBmb3IoIGsgaW4gZnZjICl7XG4gICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5nZXRBdHRycyhrLCBzaG93aW5nW2xdKTtcbiAgICAgICAgICBmb3IodmFyIG0gPSAwOyBtIDwgYXR0cnMubGVuZ3RoOyBtKyspIHtcbiAgICAgICAgICAgIGZ2Y1trXVthdHRyc1ttXV0uc2VsZWN0ZWQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhmdmMpXG4gICAgcmV0dXJuIGZ2YztcbiAgfVxuICBcbiAgcG9wdWxhdGVDb3VudGVycyhmdmMpe1xuXG4gICAgaWYodGhpcy5wb3B1bGF0ZUNvdW50KSB7XG4gICAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMuRklMVEVSUy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZm5hbWUgPSB0aGlzLkZJTFRFUlNbaV1bJ25hbWUnXTtcbiAgICAgICAgdmFyIGNwID0gdGhpcy5GSUxURVJTW2ldWydjb3VudFByZWZpeCddO1xuICAgICAgICB2YXIgc3AgPSB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkUHJlZml4J107XG4gICAgICAgIFxuICAgICAgICBpZiggY3AgfHwgc3AgKSB7XG4gICAgICAgICAgZm9yKCB2YXIgayBpbiBmdmNbZm5hbWVdICl7XG4gICAgICAgICAgICBpZihjcCkge1xuICAgICAgICAgICAgICB2YXIgY2VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7Y3B9JHtrfWApXG4gICAgICAgICAgICAgICAgICBjZWwudGV4dENvbnRlbnQgPSBmdmNbZm5hbWVdW2tdLmNvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoc3ApIHtcbiAgICAgICAgICAgICAgdmFyIHNlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3NwfSR7a31gKVxuICAgICAgICAgICAgICAgICAgc2VsLnRleHRDb250ZW50ID0gZnZjW2ZuYW1lXVtrXS5zZWxlY3RlZDtcbiAgICAgICAgICAgICAgaWYodGhpcy5zZXREaXNhYmxlZEJ1dHRvbkNsYXNzKSB7XG4gICAgICAgICAgICAgICAgaWYoIHNlbC50ZXh0Q29udGVudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmFkZENsYXNzSWZNaXNzaW5nKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRklMVEVSU1tpXVsncHJlZml4J10rayksIHRoaXMuc2V0RGlzYWJsZWRCdXR0b25DbGFzcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuZGVsQ2xhc3NJZlByZXNlbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5GSUxURVJTW2ldWydwcmVmaXgnXStrKSwgdGhpcy5zZXREaXNhYmxlZEJ1dHRvbkNsYXNzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgXG4gIC8qKiAgXG4gICAqIGdldEF0dHJzIC0gcmV0dXJucyBhbiBhcnJheSBvZiBkYXRhLWF0dHIgYXR0cmlidXRlcyBvZiBhbiBlbGVtZW50IGVsZW1cbiAgICovICAgXG4gIGdldEF0dHJzKGF0dHIsIGVsZW0pIHtcbiAgICByZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtJysgYXR0ciApXG4gICAgICAgICAgICAgIC5zcGxpdChcIiBcIilcbiAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihlbCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgfSk7XG4gIH1cbiAgXG4gIHNob3dBbGwoZmlsdGVyKSB7XG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKGZpbHRlcikge1xuICAgICAgICBpZih0aGlzLkZJTFRFUlNbaV1bJ25hbWUnXSA9PT0gZmlsdGVyKSB7XG4gICAgICAgICAgdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddID0gW107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXSA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNob3dDaGVjayhmaWx0ZXIpXG4gIH1cbiAgXG4gIGNoZWNrRmlsdGVyKHRhZywgdGFnVHlwZSkge1xuICAgIFxuICAgIC8qIFNlbGVjdHMgY2xpY2tlZCBidXR0b24uKi8gICBcbiAgICB2YXIgc2VsZWN0ZWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHt0YWdUeXBlfSR7dGFnfWApO1xuICAgIFxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuRklMVEVSUy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGlmICggdGhpcy5GSUxURVJTW2ldWydwcmVmaXgnXSA9PT0gdGFnVHlwZSApIHtcbiAgICAgICAgaWYgKCB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10uaW5kZXhPZih0YWcpID49IDAgKSB7IFxuICAgICAgICAgIC8qIGFscmVhZHkgc2VsZWN0ZWQsIGRlc2VsZWN0IHRhZyAqL1xuICAgICAgICAgIHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXS5zcGxpY2UodGFnLDEpO1xuICAgICAgICAgIHRoaXMuZGVsQ2xhc3NJZlByZXNlbnQoc2VsZWN0ZWRCdG4sIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpO1xuICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAvKiBhZGQgdGFnIHRvIHNlbGVjdGVkIGxpc3QgKi9cbiAgICAgICAgICB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10ucHVzaCh0YWcpO1xuICAgICAgICAgIHRoaXMuYWRkQ2xhc3NJZk1pc3Npbmcoc2VsZWN0ZWRCdG4sIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpO1xuICAgICAgICB9IFxuICAgICAgICB0aGlzLmRlbENsYXNzSWZQcmVzZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5GSUxURVJTW2ldWydhbGxTZWxlY3RvciddKSwgdGhpcy5hY3RpdmVCdXR0b25DbGFzcyk7XG4gICAgICAgIHRoaXMuc2hvd0NoZWNrKHRoaXMuRklMVEVSU1tpXVsnbmFtZSddKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIC8qKlxuICAqIHNob3dDaGVjayAtIEFwcGxpZXMgXCJzaG93XCIgY2xhc3MgdG8gaXRlbXMgY29udGFpbmluZyBzZWxlY3RlZCB0YWdzXG4gICovIFxuICBzaG93Q2hlY2soZmlsdGVyLCBpc0luaXRpYWwpIHtcbiAgXG4gICAgLyogSWYgbm8gdGFncy9saWNlbnNlcyBzZWxlY3RlZCwgb3IgYWxsIHRhZ3Mgc2VsZWN0ZWQsIFNIT1cgQUxMIGFuZCBERVNFTEVDVCBBTEwgQlVUVE9OUy4gKi8gICBcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiggdGhpcy5GSUxURVJTW2ldWyduYW1lJ10gPT09IGZpbHRlciApIHtcbiAgICAgICAgaWYoICh0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10ubGVuZ3RoID09PSAwKSB8fCBcbiAgICAgICAgICAgICh0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10ubGVuZ3RoID09PSB0aGlzLkZJTFRFUlNbaV1bJ2J1dHRvblRvdGFsJ10pICkgXG4gICAgICAgIHsgIFxuICAgICAgICAgIHZhciBpQnRucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5GSUxURVJTW2ldWydidXR0b25DbGFzcyddKTtcbiAgICAgICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCBpQnRucy5sZW5ndGg7IGorKyApIHtcbiAgICAgICAgICAgIHRoaXMuZGVsQ2xhc3NJZlByZXNlbnQoaUJ0bnNbal0sIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYWRkQ2xhc3NJZk1pc3NpbmcoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLkZJTFRFUlNbaV1bJ2FsbFNlbGVjdG9yJ10pLCB0aGlzLmFjdGl2ZUJ1dHRvbkNsYXNzKVxuICAgICAgICB9XG4gICAgICB9IFxuICAgIH1cbiAgICBcbiAgICB0aGlzLnNlbGVjdGVkSXRlbUNvdW50PTA7XG4gICAgXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJJdGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIC8qIEZpcnN0IHJlbW92ZSBcInNob3dcIiBjbGFzcyAqL1xuICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudCh0aGlzLmZpbHRlckl0ZW1zW2ldLCB0aGlzLnNob3dJdGVtQ2xhc3MpO1xuICAgICAgXG4gICAgICB2YXIgdmlzaWJpbGl0eSA9IDA7XG4gICAgICAvKiBzaG93IGl0ZW0gb25seSBpZiB2aXNpYmlsaXR5IGlzIHRydWUgZm9yIGFsbCBmaWx0ZXJzICovXG4gICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBqKysgKSB7XG4gICAgICAgIGlmICggdGhpcy5jaGVja1Zpc2liaWxpdHkodGhpcy5GSUxURVJTW2pdWydzZWxlY3RlZCddLCB0aGlzLmZpbHRlckl0ZW1zW2ldLmdldEF0dHJpYnV0ZSh0aGlzLkZJTFRFUlNbal1bJ2F0dHJOYW1lJ10pKSApIHtcbiAgICAgICAgICB2aXNpYmlsaXR5Kys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8qIFRoZW4gY2hlY2sgaWYgXCJzaG93XCIgY2xhc3Mgc2hvdWxkIGJlIGFwcGxpZWQgKi9cbiAgICAgIGlmICggdmlzaWJpbGl0eSA9PT0gdGhpcy5GSUxURVJTLmxlbmd0aCApIHtcbiAgICAgICAgaWYgKCAhdGhpcy5maWx0ZXJJdGVtc1tpXS5jbGFzc0xpc3QuY29udGFpbnModGhpcy5zaG93SXRlbUNsYXNzKSApIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbUNvdW50Kys7XG4gICAgICAgICAgdGhpcy5hZGRDbGFzc0lmTWlzc2luZyh0aGlzLmZpbHRlckl0ZW1zW2ldLCB0aGlzLnNob3dJdGVtQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY291bnRlclNlbGVjdG9yKSkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb3VudGVyU2VsZWN0b3IpLnRleHRDb250ZW50PWAke3RoaXMuc2VsZWN0ZWRJdGVtQ291bnR9YDtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5jaGVja0J1dHRvbkNvdW50cyhpc0luaXRpYWwpXG4gICAgXG4gIH1cbiAgXG4gIFxuICAvKiogIFxuICAgKiBjaGVja0Rpc2FibGVkQnV0dG9ucyAtIEZvciBlYWNoIHRhZy9zZWN0aW9uL3doYXRldmVyOiBcbiAgICogICAgYS4gY291bnQgaXRlbXMgd2l0aCB0YWcgXG4gICAqICAgIGIuIGNvdW50IGl0ZW1zIHdpdGggdGFnIHRoYXQgYXJlIGhpZGRlbiBcbiAgICogICAgaWYgYSA9PSBiIDogbWFyayBidXR0b24gZm9yIHRoYXQgdGFnIGFzIGRpc2FibGVkO1xuICAgKi8gICBcbiAgY2hlY2tCdXR0b25Db3VudHMoaXNJbml0aWFsKXtcbiAgICB0aGlzLmZpbHRlclZhbHVlcyA9IHRoaXMuaW5pdEZpbHRlckNvdW50KHRoaXMuZmlsdGVyVmFsdWVzLCBpc0luaXRpYWwpO1xuICAgIHRoaXMucG9wdWxhdGVDb3VudGVycyh0aGlzLmZpbHRlclZhbHVlcyk7XG5cbiAgfVxuICBcbiAgXG4gIC8qKlxuICAqIGNoZWNrVmlzaWJpbGl0eSAtIFRlc3RzIGlmIGF0dHJpYnV0ZSBpcyBpbmNsdWRlZCBpbiBsaXN0LlxuICAqLyBcbiAgY2hlY2tWaXNpYmlsaXR5KGxpc3QsIGRhdGFBdHRyKSB7XG4gICAgLyogUmV0dXJucyBUUlVFIGlmIGxpc3QgaXMgZW1wdHkgb3IgYXR0cmlidXRlIGlzIGluIGxpc3QgKi8gICBcbiAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IodmFyIHYgPSAwOyB2IDwgbGlzdC5sZW5ndGg7IHYrKyl7XG4gICAgICAgIGlmKGRhdGFBdHRyLmluZGV4T2YobGlzdFt2XSkgPj0wICkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZSBcbiAgICB9XG4gIH1cbiAgXG4gIGFkZENsYXNzSWZNaXNzaW5nKGVsLCBjbikge1xuICAgIGlmKCFlbC5jbGFzc0xpc3QuY29udGFpbnMoY24pKSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGNuKTtcbiAgICB9IFxuICB9XG4gIFxuICBkZWxDbGFzc0lmUHJlc2VudChlbCwgY24pIHtcbiAgICBpZihlbC5jbGFzc0xpc3QuY29udGFpbnMoY24pKSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNuKVxuICAgIH0gXG4gIH1cbn1cblxud2luZG93WydIdWdvVGFnc0ZpbHRlciddID0gSHVnb1RhZ3NGaWx0ZXI7XG4iXX0=
