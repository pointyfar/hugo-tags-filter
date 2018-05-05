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
          var arr = dataAttr.split(" ").filter(function (el) {
            return el.length > 0;
          });
          if (arr.indexOf(list[v]) >= 0) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaHVnb3RhZ3NmaWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQTs7Ozs7OztJQU9NLGM7QUFDSiwwQkFBWSxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLFFBQUksaUJBQWlCLENBQ25CO0FBQ0UsWUFBTSxLQURSO0FBRUUsY0FBUSxNQUZWO0FBR0UsbUJBQWEsWUFIZjtBQUlFLG1CQUFhLGtCQUpmO0FBS0UsZ0JBQVUsV0FMWjtBQU1FLG1CQUFhO0FBTmYsS0FEbUIsRUFTbkI7QUFDRSxZQUFNLFNBRFI7QUFFRSxjQUFRLE1BRlY7QUFHRSxtQkFBYSxZQUhmO0FBSUUsbUJBQWEsc0JBSmY7QUFLRSxnQkFBVSxjQUxaO0FBTUUsbUJBQWE7QUFOZixLQVRtQixDQUFyQjs7QUFtQkEsU0FBSyxPQUFMLEdBQWdCLFVBQVUsT0FBTyxPQUFsQixHQUE2QixPQUFPLE9BQXBDLEdBQThDLGNBQTdEO0FBQ0EsU0FBSyxhQUFMLEdBQXNCLFVBQVUsT0FBTyxhQUFsQixHQUFtQyxPQUFPLGFBQTFDLEdBQTBELFNBQS9FO0FBQ0EsU0FBSyxpQkFBTCxHQUEwQixVQUFVLE9BQU8saUJBQWxCLEdBQXVDLE9BQU8saUJBQTlDLEdBQWtFLFFBQTNGO0FBQ0EsU0FBSyxlQUFMLEdBQXdCLFVBQVUsT0FBTyxlQUFsQixHQUFxQyxPQUFPLGVBQTVDLEdBQThELGdCQUFyRjtBQUNBLFNBQUssZUFBTCxHQUF3QixVQUFVLE9BQU8sZUFBbEIsR0FBcUMsT0FBTyxlQUE1QyxHQUE4RCxtQkFBckY7O0FBRUEsU0FBSyxhQUFMLEdBQXNCLFVBQVUsT0FBTyxhQUFsQixHQUFtQyxPQUFPLGFBQTFDLEdBQTBELEtBQS9FO0FBQ0EsU0FBSyxzQkFBTCxHQUErQixVQUFVLE9BQU8sc0JBQWxCLEdBQTRDLE9BQU8sc0JBQW5ELEdBQTRFLEtBQTFHOztBQUdBLFNBQUssV0FBTCxHQUFt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LEVBQXBCO0FBQ0Q7QUFDRjs7Ozs7O0FBR0gsT0FBTyxnQkFBUCxJQUEyQixjQUEzQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQG5hbWUgJ0h1Z28gVGFncyBGaWx0ZXInXG4gKiBAdmVyc2lvbiAxLjAuMVxuICogQGxpY2Vuc2UgTUlUICBcbiAqIEBhdXRob3IgUG9pbnR5RmFyIFxuICovIFxuXG5jbGFzcyBIdWdvVGFnc0ZpbHRlciB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIHZhciBkZWZhdWx0RmlsdGVycyA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3RhZycsXG4gICAgICAgIHByZWZpeDogJ3RmdC0nLFxuICAgICAgICBidXR0b25DbGFzczogJ3RmdC1idXR0b24nLFxuICAgICAgICBhbGxTZWxlY3RvcjogJyN0ZlNlbGVjdEFsbFRhZ3MnLFxuICAgICAgICBhdHRyTmFtZTogJ2RhdGEtdGFncycsXG4gICAgICAgIGNvdW50UHJlZml4OiAnY3RmdC0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnc2VjdGlvbicsXG4gICAgICAgIHByZWZpeDogJ3Rmcy0nLFxuICAgICAgICBidXR0b25DbGFzczogJ3Rmcy1idXR0b24nLFxuICAgICAgICBhbGxTZWxlY3RvcjogJyN0ZlNlbGVjdEFsbFNlY3Rpb25zJyxcbiAgICAgICAgYXR0ck5hbWU6ICdkYXRhLXNlY3Rpb24nLFxuICAgICAgICBjb3VudFByZWZpeDogJ2N0ZnQtJ1xuICAgICAgfVxuICAgIF1cbiAgICBcbiAgICB0aGlzLkZJTFRFUlMgPSAoY29uZmlnICYmIGNvbmZpZy5maWx0ZXJzKSA/IGNvbmZpZy5maWx0ZXJzIDogZGVmYXVsdEZpbHRlcnM7XG4gICAgdGhpcy5zaG93SXRlbUNsYXNzID0gKGNvbmZpZyAmJiBjb25maWcuc2hvd0l0ZW1DbGFzcykgPyBjb25maWcuc2hvd0l0ZW1DbGFzcyA6IFwidGYtc2hvd1wiO1xuICAgIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MgPSAoY29uZmlnICYmIGNvbmZpZy5hY3RpdmVCdXR0b25DbGFzcykgPyBjb25maWcuYWN0aXZlQnV0dG9uQ2xhc3MgOiBcImFjdGl2ZVwiO1xuICAgIHRoaXMuZmlsdGVySXRlbUNsYXNzID0gKGNvbmZpZyAmJiBjb25maWcuZmlsdGVySXRlbUNsYXNzKSA/IGNvbmZpZy5maWx0ZXJJdGVtQ2xhc3MgOiBcInRmLWZpbHRlci1pdGVtXCI7XG4gICAgdGhpcy5jb3VudGVyU2VsZWN0b3IgPSAoY29uZmlnICYmIGNvbmZpZy5jb3VudGVyU2VsZWN0b3IpID8gY29uZmlnLmNvdW50ZXJTZWxlY3RvciA6IFwic2VsZWN0ZWRJdGVtQ291bnRcIjtcbiAgICBcbiAgICB0aGlzLnBvcHVsYXRlQ291bnQgPSAoY29uZmlnICYmIGNvbmZpZy5wb3B1bGF0ZUNvdW50KSA/IGNvbmZpZy5wb3B1bGF0ZUNvdW50IDogZmFsc2U7XG4gICAgdGhpcy5zZXREaXNhYmxlZEJ1dHRvbkNsYXNzID0gKGNvbmZpZyAmJiBjb25maWcuc2V0RGlzYWJsZWRCdXR0b25DbGFzcykgPyBjb25maWcuc2V0RGlzYWJsZWRCdXR0b25DbGFzcyA6IGZhbHNlO1xuICAgIFxuICAgIFxuICAgIHRoaXMuZmlsdGVySXRlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMuZmlsdGVySXRlbUNsYXNzKTtcbiAgICB0aGlzLnNlbGVjdGVkSXRlbUNvdW50ID0gMDtcbiAgICBcbiAgICB0aGlzLmZpbHRlclZhbHVlcyA9IHt9O1xuICAgIFxuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5GSUxURVJTLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLkZJTFRFUlNbaV1bJ2J1dHRvblRvdGFsJ10gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMuRklMVEVSU1tpXVsnYnV0dG9uQ2xhc3MnXSkubGVuZ3RoO1xuICAgICAgdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddID0gW107XG4gICAgICB0aGlzLkZJTFRFUlNbaV1bJ3ZhbHVlcyddID0gW107XG4gICAgICB2YXIgZnYgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMuRklMVEVSU1tpXVsnYnV0dG9uQ2xhc3MnXSk7XG4gICAgICBcbiAgICAgIC8qKiAgICAgIFxuICAgICAgKiBCdWlsZCBpbmRleCBvZiBhbGwgZmlsdGVyIHZhbHVlcyBhbmQgdGhlaXIgY291bnRzICAgICAgXG4gICAgICAqLyAgICAgICBcbiAgICAgIHRoaXMuZmlsdGVyVmFsdWVzW3RoaXMuRklMVEVSU1tpXVsnbmFtZSddXSA9IFtdOyBcbiAgICAgIGZvciggdmFyIGogPSAwOyBqIDwgZnYubGVuZ3RoOyBqKysgKXtcbiAgICAgICAgdmFyIHYgPSBmdltqXS5pZC5yZXBsYWNlKHRoaXMuRklMVEVSU1tpXVtcInByZWZpeFwiXSwgJycpO1xuICAgICAgICB0aGlzLmZpbHRlclZhbHVlc1t0aGlzLkZJTFRFUlNbaV1bJ25hbWUnXV1bdl0gPSB7Y291bnQ6MCwgc2VsZWN0ZWQ6MH07XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2hvd0NoZWNrKHRoaXMuRklMVEVSU1swXVsnbmFtZSddLCB0cnVlKTtcblxuXG4gIH1cbiAgXG4gIGluaXRGaWx0ZXJDb3VudChmdmMsIGlzSW5pdGlhbCl7XG4gICAgXG4gICAgLyoqICAgIFxuICAgICAqIEluaXRpYWxpc2UgY291bnQgPSBzZWxlY3RlZFxuICAgICAqLyAgICAgXG4gICAgaWYoaXNJbml0aWFsKSB7XG4gICAgICBmb3IoIHZhciBrIGluIGZ2YyApIHtcbiAgICAgICAgZm9yKCB2YXIgeCA9IDA7IHggPCB0aGlzLmZpbHRlckl0ZW1zLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5nZXRBdHRycyhrLCB0aGlzLmZpbHRlckl0ZW1zW3hdKTtcbiAgICAgICAgICBmb3IodmFyIGwgPSAwOyBsIDxhdHRycy5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgZnZjW2tdW2F0dHJzW2xdXS5jb3VudCsrO1xuICAgICAgICAgICAgZnZjW2tdW2F0dHJzW2xdXS5zZWxlY3RlZCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc2hvd2luZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5zaG93SXRlbUNsYXNzKTtcbiAgICAgIGZvciggdmFyIGsgaW4gZnZjICkge1xuICAgICAgICBmb3IoIHZhciBrMiBpbiBmdmNba10gKXtcbiAgICAgICAgICBmdmNba11bazJdLnNlbGVjdGVkID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yKHZhciBsID0gMDsgbCA8IHNob3dpbmcubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgZm9yKCBrIGluIGZ2YyApe1xuICAgICAgICAgIHZhciBhdHRycyA9IHRoaXMuZ2V0QXR0cnMoaywgc2hvd2luZ1tsXSk7XG4gICAgICAgICAgZm9yKHZhciBtID0gMDsgbSA8IGF0dHJzLmxlbmd0aDsgbSsrKSB7XG4gICAgICAgICAgICBmdmNba11bYXR0cnNbbV1dLnNlbGVjdGVkKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ2YztcbiAgfVxuICBcbiAgcG9wdWxhdGVDb3VudGVycyhmdmMpe1xuXG4gICAgaWYodGhpcy5wb3B1bGF0ZUNvdW50KSB7XG4gICAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMuRklMVEVSUy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZm5hbWUgPSB0aGlzLkZJTFRFUlNbaV1bJ25hbWUnXTtcbiAgICAgICAgdmFyIGNwID0gdGhpcy5GSUxURVJTW2ldWydjb3VudFByZWZpeCddO1xuICAgICAgICB2YXIgc3AgPSB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkUHJlZml4J107XG4gICAgICAgIFxuICAgICAgICBpZiggY3AgfHwgc3AgKSB7XG4gICAgICAgICAgZm9yKCB2YXIgayBpbiBmdmNbZm5hbWVdICl7XG4gICAgICAgICAgICBpZihjcCkge1xuICAgICAgICAgICAgICB2YXIgY2VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7Y3B9JHtrfWApXG4gICAgICAgICAgICAgICAgICBjZWwudGV4dENvbnRlbnQgPSBmdmNbZm5hbWVdW2tdLmNvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoc3ApIHtcbiAgICAgICAgICAgICAgdmFyIHNlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3NwfSR7a31gKVxuICAgICAgICAgICAgICAgICAgc2VsLnRleHRDb250ZW50ID0gZnZjW2ZuYW1lXVtrXS5zZWxlY3RlZDtcbiAgICAgICAgICAgICAgaWYodGhpcy5zZXREaXNhYmxlZEJ1dHRvbkNsYXNzKSB7XG4gICAgICAgICAgICAgICAgaWYoIHNlbC50ZXh0Q29udGVudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmFkZENsYXNzSWZNaXNzaW5nKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRklMVEVSU1tpXVsncHJlZml4J10rayksIHRoaXMuc2V0RGlzYWJsZWRCdXR0b25DbGFzcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuZGVsQ2xhc3NJZlByZXNlbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5GSUxURVJTW2ldWydwcmVmaXgnXStrKSwgdGhpcy5zZXREaXNhYmxlZEJ1dHRvbkNsYXNzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgXG4gIC8qKiAgXG4gICAqIGdldEF0dHJzIC0gcmV0dXJucyBhbiBhcnJheSBvZiBkYXRhLWF0dHIgYXR0cmlidXRlcyBvZiBhbiBlbGVtZW50IGVsZW1cbiAgICovICAgXG4gIGdldEF0dHJzKGF0dHIsIGVsZW0pIHtcbiAgICByZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtJysgYXR0ciApXG4gICAgICAgICAgICAgIC5zcGxpdChcIiBcIilcbiAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihlbCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgfSk7XG4gIH1cbiAgXG4gIHNob3dBbGwoZmlsdGVyKSB7XG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKGZpbHRlcikge1xuICAgICAgICBpZih0aGlzLkZJTFRFUlNbaV1bJ25hbWUnXSA9PT0gZmlsdGVyKSB7XG4gICAgICAgICAgdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddID0gW107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXSA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNob3dDaGVjayhmaWx0ZXIpXG4gIH1cbiAgXG4gIGNoZWNrRmlsdGVyKHRhZywgdGFnVHlwZSkge1xuICAgIFxuICAgIC8qIFNlbGVjdHMgY2xpY2tlZCBidXR0b24uKi8gICBcbiAgICB2YXIgc2VsZWN0ZWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHt0YWdUeXBlfSR7dGFnfWApO1xuICAgIFxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuRklMVEVSUy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGlmICggdGhpcy5GSUxURVJTW2ldWydwcmVmaXgnXSA9PT0gdGFnVHlwZSApIHtcbiAgICAgICAgaWYgKCB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10uaW5kZXhPZih0YWcpID49IDAgKSB7IFxuICAgICAgICAgIC8qIGFscmVhZHkgc2VsZWN0ZWQsIGRlc2VsZWN0IHRhZyAqL1xuICAgICAgICAgIHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXS5zcGxpY2UodGFnLDEpO1xuICAgICAgICAgIHRoaXMuZGVsQ2xhc3NJZlByZXNlbnQoc2VsZWN0ZWRCdG4sIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpO1xuICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAvKiBhZGQgdGFnIHRvIHNlbGVjdGVkIGxpc3QgKi9cbiAgICAgICAgICB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10ucHVzaCh0YWcpO1xuICAgICAgICAgIHRoaXMuYWRkQ2xhc3NJZk1pc3Npbmcoc2VsZWN0ZWRCdG4sIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpO1xuICAgICAgICB9IFxuICAgICAgICB0aGlzLmRlbENsYXNzSWZQcmVzZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5GSUxURVJTW2ldWydhbGxTZWxlY3RvciddKSwgdGhpcy5hY3RpdmVCdXR0b25DbGFzcyk7XG4gICAgICAgIHRoaXMuc2hvd0NoZWNrKHRoaXMuRklMVEVSU1tpXVsnbmFtZSddKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIC8qKlxuICAqIHNob3dDaGVjayAtIEFwcGxpZXMgXCJzaG93XCIgY2xhc3MgdG8gaXRlbXMgY29udGFpbmluZyBzZWxlY3RlZCB0YWdzXG4gICovIFxuICBzaG93Q2hlY2soZmlsdGVyLCBpc0luaXRpYWwpIHtcbiAgXG4gICAgLyogSWYgbm8gdGFncy9saWNlbnNlcyBzZWxlY3RlZCwgb3IgYWxsIHRhZ3Mgc2VsZWN0ZWQsIFNIT1cgQUxMIGFuZCBERVNFTEVDVCBBTEwgQlVUVE9OUy4gKi8gICBcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiggdGhpcy5GSUxURVJTW2ldWyduYW1lJ10gPT09IGZpbHRlciApIHtcbiAgICAgICAgaWYoICh0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10ubGVuZ3RoID09PSAwKSB8fCBcbiAgICAgICAgICAgICh0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10ubGVuZ3RoID09PSB0aGlzLkZJTFRFUlNbaV1bJ2J1dHRvblRvdGFsJ10pICkgXG4gICAgICAgIHsgIFxuICAgICAgICAgIHZhciBpQnRucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5GSUxURVJTW2ldWydidXR0b25DbGFzcyddKTtcbiAgICAgICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCBpQnRucy5sZW5ndGg7IGorKyApIHtcbiAgICAgICAgICAgIHRoaXMuZGVsQ2xhc3NJZlByZXNlbnQoaUJ0bnNbal0sIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYWRkQ2xhc3NJZk1pc3NpbmcoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLkZJTFRFUlNbaV1bJ2FsbFNlbGVjdG9yJ10pLCB0aGlzLmFjdGl2ZUJ1dHRvbkNsYXNzKVxuICAgICAgICB9XG4gICAgICB9IFxuICAgIH1cbiAgICBcbiAgICB0aGlzLnNlbGVjdGVkSXRlbUNvdW50PTA7XG4gICAgXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJJdGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIC8qIEZpcnN0IHJlbW92ZSBcInNob3dcIiBjbGFzcyAqL1xuICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudCh0aGlzLmZpbHRlckl0ZW1zW2ldLCB0aGlzLnNob3dJdGVtQ2xhc3MpO1xuICAgICAgXG4gICAgICB2YXIgdmlzaWJpbGl0eSA9IDA7XG4gICAgICAvKiBzaG93IGl0ZW0gb25seSBpZiB2aXNpYmlsaXR5IGlzIHRydWUgZm9yIGFsbCBmaWx0ZXJzICovXG4gICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBqKysgKSB7XG4gICAgICAgIGlmICggdGhpcy5jaGVja1Zpc2liaWxpdHkodGhpcy5GSUxURVJTW2pdWydzZWxlY3RlZCddLCB0aGlzLmZpbHRlckl0ZW1zW2ldLmdldEF0dHJpYnV0ZSh0aGlzLkZJTFRFUlNbal1bJ2F0dHJOYW1lJ10pKSApIHtcbiAgICAgICAgICB2aXNpYmlsaXR5Kys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8qIFRoZW4gY2hlY2sgaWYgXCJzaG93XCIgY2xhc3Mgc2hvdWxkIGJlIGFwcGxpZWQgKi9cbiAgICAgIGlmICggdmlzaWJpbGl0eSA9PT0gdGhpcy5GSUxURVJTLmxlbmd0aCApIHtcbiAgICAgICAgaWYgKCAhdGhpcy5maWx0ZXJJdGVtc1tpXS5jbGFzc0xpc3QuY29udGFpbnModGhpcy5zaG93SXRlbUNsYXNzKSApIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbUNvdW50Kys7XG4gICAgICAgICAgdGhpcy5hZGRDbGFzc0lmTWlzc2luZyh0aGlzLmZpbHRlckl0ZW1zW2ldLCB0aGlzLnNob3dJdGVtQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY291bnRlclNlbGVjdG9yKSkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb3VudGVyU2VsZWN0b3IpLnRleHRDb250ZW50PWAke3RoaXMuc2VsZWN0ZWRJdGVtQ291bnR9YDtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5jaGVja0J1dHRvbkNvdW50cyhpc0luaXRpYWwpXG4gICAgXG4gIH1cbiAgXG4gIGNoZWNrQnV0dG9uQ291bnRzKGlzSW5pdGlhbCl7XG4gICAgdGhpcy5maWx0ZXJWYWx1ZXMgPSB0aGlzLmluaXRGaWx0ZXJDb3VudCh0aGlzLmZpbHRlclZhbHVlcywgaXNJbml0aWFsKTtcbiAgICB0aGlzLnBvcHVsYXRlQ291bnRlcnModGhpcy5maWx0ZXJWYWx1ZXMpO1xuXG4gIH1cbiAgXG4gIFxuICAvKipcbiAgKiBjaGVja1Zpc2liaWxpdHkgLSBUZXN0cyBpZiBhdHRyaWJ1dGUgaXMgaW5jbHVkZWQgaW4gbGlzdC5cbiAgKi8gXG4gIGNoZWNrVmlzaWJpbGl0eShsaXN0LCBkYXRhQXR0cikge1xuICAgIC8qIFJldHVybnMgVFJVRSBpZiBsaXN0IGlzIGVtcHR5IG9yIGF0dHJpYnV0ZSBpcyBpbiBsaXN0ICovICAgXG4gICAgaWYgKGxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgZm9yKHZhciB2ID0gMDsgdiA8IGxpc3QubGVuZ3RoOyB2Kyspe1xuICAgICAgICB2YXIgYXJyID0gZGF0YUF0dHIuc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oZWwpe3JldHVybiBlbC5sZW5ndGggPiAwfSk7XG4gICAgICAgIGlmKGFyci5pbmRleE9mKGxpc3Rbdl0pID49MCApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWUgXG4gICAgfVxuICB9XG4gIFxuICBhZGRDbGFzc0lmTWlzc2luZyhlbCwgY24pIHtcbiAgICBpZighZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNuKSkge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbik7XG4gICAgfSBcbiAgfVxuICBcbiAgZGVsQ2xhc3NJZlByZXNlbnQoZWwsIGNuKSB7XG4gICAgaWYoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNuKSkge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbilcbiAgICB9IFxuICB9XG59XG5cbndpbmRvd1snSHVnb1RhZ3NGaWx0ZXInXSA9IEh1Z29UYWdzRmlsdGVyO1xuIl19
