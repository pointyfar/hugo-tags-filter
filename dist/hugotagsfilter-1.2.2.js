(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @name 'Hugo Tags Filter'
 * @version 1.2.2
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
      attrName: 'data-tags'
    }, {
      name: 'section',
      prefix: 'tfs-',
      buttonClass: 'tfs-button',
      allSelector: '#tfSelectAllSections',
      attrName: 'data-section'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaHVnb3RhZ3NmaWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQTs7Ozs7OztJQU9NLGM7QUFDSiwwQkFBWSxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLFFBQUksaUJBQWlCLENBQ25CO0FBQ0UsWUFBTSxLQURSO0FBRUUsY0FBUSxNQUZWO0FBR0UsbUJBQWEsWUFIZjtBQUlFLG1CQUFhLGtCQUpmO0FBS0UsZ0JBQVU7QUFMWixLQURtQixFQVFuQjtBQUNFLFlBQU0sU0FEUjtBQUVFLGNBQVEsTUFGVjtBQUdFLG1CQUFhLFlBSGY7QUFJRSxtQkFBYSxzQkFKZjtBQUtFLGdCQUFVO0FBTFosS0FSbUIsQ0FBckI7O0FBaUJBLFNBQUssT0FBTCxHQUFnQixVQUFVLE9BQU8sT0FBbEIsR0FBNkIsT0FBTyxPQUFwQyxHQUE4QyxjQUE3RDtBQUNBLFNBQUssYUFBTCxHQUFzQixVQUFVLE9BQU8sYUFBbEIsR0FBbUMsT0FBTyxhQUExQyxHQUEwRCxTQUEvRTtBQUNBLFNBQUssaUJBQUwsR0FBMEIsVUFBVSxPQUFPLGlCQUFsQixHQUF1QyxPQUFPLGlCQUE5QyxHQUFrRSxRQUEzRjtBQUNBLFNBQUssZUFBTCxHQUF3QixVQUFVLE9BQU8sZUFBbEIsR0FBcUMsT0FBTyxlQUE1QyxHQUE4RCxnQkFBckY7QUFDQSxTQUFLLGVBQUwsR0FBd0IsVUFBVSxPQUFPLGVBQWxCLEdBQXFDLE9BQU8sZUFBNUMsR0FBOEQsbUJBQXJGOztBQUVBLFNBQUssYUFBTCxHQUFzQixVQUFVLE9BQU8sYUFBbEIsR0FBbUMsT0FBTyxhQUExQyxHQUEwRCxLQUEvRTtBQUNBLFNBQUssc0JBQUwsR0FBK0IsVUFBVSxPQUFPLHNCQUFsQixHQUE0QyxPQUFPLHNCQUFuRCxHQUE0RSxLQUExRzs7QUFHQSxTQUFLLFdBQUwsR0FBbUIsU0FBUyxzQkFBVCxDQUFnQyxLQUFLLGVBQXJDLENB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Z0JBQVAsSUFBMkIsY0FBM0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIEBuYW1lICdIdWdvIFRhZ3MgRmlsdGVyJ1xuICogQHZlcnNpb24gMS4yLjJcbiAqIEBsaWNlbnNlIE1JVCAgXG4gKiBAYXV0aG9yIFBvaW50eUZhciBcbiAqLyBcblxuY2xhc3MgSHVnb1RhZ3NGaWx0ZXIge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICB2YXIgZGVmYXVsdEZpbHRlcnMgPSBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd0YWcnLFxuICAgICAgICBwcmVmaXg6ICd0ZnQtJyxcbiAgICAgICAgYnV0dG9uQ2xhc3M6ICd0ZnQtYnV0dG9uJyxcbiAgICAgICAgYWxsU2VsZWN0b3I6ICcjdGZTZWxlY3RBbGxUYWdzJyxcbiAgICAgICAgYXR0ck5hbWU6ICdkYXRhLXRhZ3MnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnc2VjdGlvbicsXG4gICAgICAgIHByZWZpeDogJ3Rmcy0nLFxuICAgICAgICBidXR0b25DbGFzczogJ3Rmcy1idXR0b24nLFxuICAgICAgICBhbGxTZWxlY3RvcjogJyN0ZlNlbGVjdEFsbFNlY3Rpb25zJyxcbiAgICAgICAgYXR0ck5hbWU6ICdkYXRhLXNlY3Rpb24nXG4gICAgICB9XG4gICAgXVxuICAgIFxuICAgIHRoaXMuRklMVEVSUyA9IChjb25maWcgJiYgY29uZmlnLmZpbHRlcnMpID8gY29uZmlnLmZpbHRlcnMgOiBkZWZhdWx0RmlsdGVycztcbiAgICB0aGlzLnNob3dJdGVtQ2xhc3MgPSAoY29uZmlnICYmIGNvbmZpZy5zaG93SXRlbUNsYXNzKSA/IGNvbmZpZy5zaG93SXRlbUNsYXNzIDogXCJ0Zi1zaG93XCI7XG4gICAgdGhpcy5hY3RpdmVCdXR0b25DbGFzcyA9IChjb25maWcgJiYgY29uZmlnLmFjdGl2ZUJ1dHRvbkNsYXNzKSA/IGNvbmZpZy5hY3RpdmVCdXR0b25DbGFzcyA6IFwiYWN0aXZlXCI7XG4gICAgdGhpcy5maWx0ZXJJdGVtQ2xhc3MgPSAoY29uZmlnICYmIGNvbmZpZy5maWx0ZXJJdGVtQ2xhc3MpID8gY29uZmlnLmZpbHRlckl0ZW1DbGFzcyA6IFwidGYtZmlsdGVyLWl0ZW1cIjtcbiAgICB0aGlzLmNvdW50ZXJTZWxlY3RvciA9IChjb25maWcgJiYgY29uZmlnLmNvdW50ZXJTZWxlY3RvcikgPyBjb25maWcuY291bnRlclNlbGVjdG9yIDogXCJzZWxlY3RlZEl0ZW1Db3VudFwiO1xuICAgIFxuICAgIHRoaXMucG9wdWxhdGVDb3VudCA9IChjb25maWcgJiYgY29uZmlnLnBvcHVsYXRlQ291bnQpID8gY29uZmlnLnBvcHVsYXRlQ291bnQgOiBmYWxzZTtcbiAgICB0aGlzLnNldERpc2FibGVkQnV0dG9uQ2xhc3MgPSAoY29uZmlnICYmIGNvbmZpZy5zZXREaXNhYmxlZEJ1dHRvbkNsYXNzKSA/IGNvbmZpZy5zZXREaXNhYmxlZEJ1dHRvbkNsYXNzIDogZmFsc2U7XG4gICAgXG4gICAgXG4gICAgdGhpcy5maWx0ZXJJdGVtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5maWx0ZXJJdGVtQ2xhc3MpO1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtQ291bnQgPSAwO1xuICAgIFxuICAgIHRoaXMuZmlsdGVyVmFsdWVzID0ge307XG4gICAgXG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuRklMVEVSU1tpXVsnYnV0dG9uVG90YWwnXSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5GSUxURVJTW2ldWydidXR0b25DbGFzcyddKS5sZW5ndGg7XG4gICAgICB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10gPSBbXTtcbiAgICAgIHRoaXMuRklMVEVSU1tpXVsndmFsdWVzJ10gPSBbXTtcbiAgICAgIHZhciBmdiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5GSUxURVJTW2ldWydidXR0b25DbGFzcyddKTtcbiAgICAgIFxuICAgICAgLyoqICAgICAgXG4gICAgICAqIEJ1aWxkIGluZGV4IG9mIGFsbCBmaWx0ZXIgdmFsdWVzIGFuZCB0aGVpciBjb3VudHMgICAgICBcbiAgICAgICovICAgICAgIFxuICAgICAgdGhpcy5maWx0ZXJWYWx1ZXNbdGhpcy5GSUxURVJTW2ldWyduYW1lJ11dID0gW107IFxuICAgICAgZm9yKCB2YXIgaiA9IDA7IGogPCBmdi5sZW5ndGg7IGorKyApe1xuICAgICAgICB2YXIgdiA9IGZ2W2pdLmlkLnJlcGxhY2UodGhpcy5GSUxURVJTW2ldW1wicHJlZml4XCJdLCAnJyk7XG4gICAgICAgIHRoaXMuZmlsdGVyVmFsdWVzW3RoaXMuRklMVEVSU1tpXVsnbmFtZSddXVt2XSA9IHtjb3VudDowLCBzZWxlY3RlZDowfTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zaG93Q2hlY2sodGhpcy5GSUxURVJTWzBdWyduYW1lJ10sIHRydWUpO1xuXG5cbiAgfVxuICBcbiAgaW5pdEZpbHRlckNvdW50KGZ2YywgaXNJbml0aWFsKXtcbiAgICBcbiAgICAvKiogICAgXG4gICAgICogSW5pdGlhbGlzZSBjb3VudCA9IHNlbGVjdGVkXG4gICAgICovICAgICBcbiAgICBpZihpc0luaXRpYWwpIHtcbiAgICAgIGZvciggdmFyIGsgaW4gZnZjICkge1xuICAgICAgICBmb3IoIHZhciB4ID0gMDsgeCA8IHRoaXMuZmlsdGVySXRlbXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICB2YXIgYXR0cnMgPSB0aGlzLmdldEF0dHJzKGssIHRoaXMuZmlsdGVySXRlbXNbeF0pO1xuICAgICAgICAgIGZvcih2YXIgbCA9IDA7IGwgPGF0dHJzLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICBmdmNba11bYXR0cnNbbF1dLmNvdW50Kys7XG4gICAgICAgICAgICBmdmNba11bYXR0cnNbbF1dLnNlbGVjdGVkKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzaG93aW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnNob3dJdGVtQ2xhc3MpO1xuICAgICAgZm9yKCB2YXIgayBpbiBmdmMgKSB7XG4gICAgICAgIGZvciggdmFyIGsyIGluIGZ2Y1trXSApe1xuICAgICAgICAgIGZ2Y1trXVtrMl0uc2VsZWN0ZWQgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IodmFyIGwgPSAwOyBsIDwgc2hvd2luZy5sZW5ndGg7IGwrKykge1xuICAgICAgICBmb3IoIGsgaW4gZnZjICl7XG4gICAgICAgICAgdmFyIGF0dHJzID0gdGhpcy5nZXRBdHRycyhrLCBzaG93aW5nW2xdKTtcbiAgICAgICAgICBmb3IodmFyIG0gPSAwOyBtIDwgYXR0cnMubGVuZ3RoOyBtKyspIHtcbiAgICAgICAgICAgIGZ2Y1trXVthdHRyc1ttXV0uc2VsZWN0ZWQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnZjO1xuICB9XG4gIFxuICBwb3B1bGF0ZUNvdW50ZXJzKGZ2Yyl7XG5cbiAgICBpZih0aGlzLnBvcHVsYXRlQ291bnQpIHtcbiAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5GSUxURVJTLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBmbmFtZSA9IHRoaXMuRklMVEVSU1tpXVsnbmFtZSddO1xuICAgICAgICB2YXIgY3AgPSB0aGlzLkZJTFRFUlNbaV1bJ2NvdW50UHJlZml4J107XG4gICAgICAgIHZhciBzcCA9IHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWRQcmVmaXgnXTtcbiAgICAgICAgXG4gICAgICAgIGlmKCBjcCB8fCBzcCApIHtcbiAgICAgICAgICBmb3IoIHZhciBrIGluIGZ2Y1tmbmFtZV0gKXtcbiAgICAgICAgICAgIGlmKGNwKSB7XG4gICAgICAgICAgICAgIHZhciBjZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHtjcH0ke2t9YClcbiAgICAgICAgICAgICAgICAgIGNlbC50ZXh0Q29udGVudCA9IGZ2Y1tmbmFtZV1ba10uY291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzcCkge1xuICAgICAgICAgICAgICB2YXIgc2VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7c3B9JHtrfWApXG4gICAgICAgICAgICAgICAgICBzZWwudGV4dENvbnRlbnQgPSBmdmNbZm5hbWVdW2tdLnNlbGVjdGVkO1xuICAgICAgICAgICAgICBpZih0aGlzLnNldERpc2FibGVkQnV0dG9uQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICBpZiggc2VsLnRleHRDb250ZW50ID09IDApIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2xhc3NJZk1pc3NpbmcoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5GSUxURVJTW2ldWydwcmVmaXgnXStrKSwgdGhpcy5zZXREaXNhYmxlZEJ1dHRvbkNsYXNzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLkZJTFRFUlNbaV1bJ3ByZWZpeCddK2spLCB0aGlzLnNldERpc2FibGVkQnV0dG9uQ2xhc3MpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBcbiAgLyoqICBcbiAgICogZ2V0QXR0cnMgLSByZXR1cm5zIGFuIGFycmF5IG9mIGRhdGEtYXR0ciBhdHRyaWJ1dGVzIG9mIGFuIGVsZW1lbnQgZWxlbVxuICAgKi8gICBcbiAgZ2V0QXR0cnMoYXR0ciwgZWxlbSkge1xuICAgIHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS0nKyBhdHRyIClcbiAgICAgICAgICAgICAgLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwubGVuZ3RoID4gMFxuICAgICAgICAgICAgICB9KTtcbiAgfVxuICBcbiAgc2hvd0FsbChmaWx0ZXIpIHtcbiAgICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMuRklMVEVSUy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYoZmlsdGVyKSB7XG4gICAgICAgIGlmKHRoaXMuRklMVEVSU1tpXVsnbmFtZSddID09PSBmaWx0ZXIpIHtcbiAgICAgICAgICB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10gPSBbXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddID0gW107XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2hvd0NoZWNrKGZpbHRlcilcbiAgfVxuICBcbiAgY2hlY2tGaWx0ZXIodGFnLCB0YWdUeXBlKSB7XG4gICAgXG4gICAgLyogU2VsZWN0cyBjbGlja2VkIGJ1dHRvbi4qLyAgIFxuICAgIHZhciBzZWxlY3RlZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke3RhZ1R5cGV9JHt0YWd9YCk7XG4gICAgXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5GSUxURVJTLmxlbmd0aDsgaSsrICkge1xuICAgICAgaWYgKCB0aGlzLkZJTFRFUlNbaV1bJ3ByZWZpeCddID09PSB0YWdUeXBlICkge1xuICAgICAgICBpZiAoIHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXS5pbmRleE9mKHRhZykgPj0gMCApIHsgXG4gICAgICAgICAgLyogYWxyZWFkeSBzZWxlY3RlZCwgZGVzZWxlY3QgdGFnICovXG4gICAgICAgICAgdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddLnNwbGljZSh0YWcsMSk7XG4gICAgICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudChzZWxlY3RlZEJ0biwgdGhpcy5hY3RpdmVCdXR0b25DbGFzcyk7XG4gICAgICAgIH0gZWxzZSB7IFxuICAgICAgICAgIC8qIGFkZCB0YWcgdG8gc2VsZWN0ZWQgbGlzdCAqL1xuICAgICAgICAgIHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXS5wdXNoKHRhZyk7XG4gICAgICAgICAgdGhpcy5hZGRDbGFzc0lmTWlzc2luZyhzZWxlY3RlZEJ0biwgdGhpcy5hY3RpdmVCdXR0b25DbGFzcyk7XG4gICAgICAgIH0gXG4gICAgICAgIHRoaXMuZGVsQ2xhc3NJZlByZXNlbnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLkZJTFRFUlNbaV1bJ2FsbFNlbGVjdG9yJ10pLCB0aGlzLmFjdGl2ZUJ1dHRvbkNsYXNzKTtcbiAgICAgICAgdGhpcy5zaG93Q2hlY2sodGhpcy5GSUxURVJTW2ldWyduYW1lJ10pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgLyoqXG4gICogc2hvd0NoZWNrIC0gQXBwbGllcyBcInNob3dcIiBjbGFzcyB0byBpdGVtcyBjb250YWluaW5nIHNlbGVjdGVkIHRhZ3NcbiAgKi8gXG4gIHNob3dDaGVjayhmaWx0ZXIsIGlzSW5pdGlhbCkge1xuICBcbiAgICAvKiBJZiBubyB0YWdzL2xpY2Vuc2VzIHNlbGVjdGVkLCBvciBhbGwgdGFncyBzZWxlY3RlZCwgU0hPVyBBTEwgYW5kIERFU0VMRUNUIEFMTCBCVVRUT05TLiAqLyAgIFxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuRklMVEVSUy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGlmKCB0aGlzLkZJTFRFUlNbaV1bJ25hbWUnXSA9PT0gZmlsdGVyICkge1xuICAgICAgICBpZiggKHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXS5sZW5ndGggPT09IDApIHx8IFxuICAgICAgICAgICAgKHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXS5sZW5ndGggPT09IHRoaXMuRklMVEVSU1tpXVsnYnV0dG9uVG90YWwnXSkgKSBcbiAgICAgICAgeyAgXG4gICAgICAgICAgdmFyIGlCdG5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLkZJTFRFUlNbaV1bJ2J1dHRvbkNsYXNzJ10pO1xuICAgICAgICAgIGZvciAoIHZhciBqID0gMDsgaiA8IGlCdG5zLmxlbmd0aDsgaisrICkge1xuICAgICAgICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudChpQnRuc1tqXSwgdGhpcy5hY3RpdmVCdXR0b25DbGFzcylcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hZGRDbGFzc0lmTWlzc2luZyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuRklMVEVSU1tpXVsnYWxsU2VsZWN0b3InXSksIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpXG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgfVxuICAgIFxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtQ291bnQ9MDtcbiAgICBcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLmZpbHRlckl0ZW1zLmxlbmd0aDsgaSsrICkge1xuICAgICAgLyogRmlyc3QgcmVtb3ZlIFwic2hvd1wiIGNsYXNzICovXG4gICAgICB0aGlzLmRlbENsYXNzSWZQcmVzZW50KHRoaXMuZmlsdGVySXRlbXNbaV0sIHRoaXMuc2hvd0l0ZW1DbGFzcyk7XG4gICAgICBcbiAgICAgIHZhciB2aXNpYmlsaXR5ID0gMDtcbiAgICAgIC8qIHNob3cgaXRlbSBvbmx5IGlmIHZpc2liaWxpdHkgaXMgdHJ1ZSBmb3IgYWxsIGZpbHRlcnMgKi9cbiAgICAgIGZvciAoIHZhciBqID0gMDsgaiA8IHRoaXMuRklMVEVSUy5sZW5ndGg7IGorKyApIHtcbiAgICAgICAgaWYgKCB0aGlzLmNoZWNrVmlzaWJpbGl0eSh0aGlzLkZJTFRFUlNbal1bJ3NlbGVjdGVkJ10sIHRoaXMuZmlsdGVySXRlbXNbaV0uZ2V0QXR0cmlidXRlKHRoaXMuRklMVEVSU1tqXVsnYXR0ck5hbWUnXSkpICkge1xuICAgICAgICAgIHZpc2liaWxpdHkrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLyogVGhlbiBjaGVjayBpZiBcInNob3dcIiBjbGFzcyBzaG91bGQgYmUgYXBwbGllZCAqL1xuICAgICAgaWYgKCB2aXNpYmlsaXR5ID09PSB0aGlzLkZJTFRFUlMubGVuZ3RoICkge1xuICAgICAgICBpZiAoICF0aGlzLmZpbHRlckl0ZW1zW2ldLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnNob3dJdGVtQ2xhc3MpICkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtQ291bnQrKztcbiAgICAgICAgICB0aGlzLmFkZENsYXNzSWZNaXNzaW5nKHRoaXMuZmlsdGVySXRlbXNbaV0sIHRoaXMuc2hvd0l0ZW1DbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb3VudGVyU2VsZWN0b3IpKSB7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvdW50ZXJTZWxlY3RvcikudGV4dENvbnRlbnQ9YCR7dGhpcy5zZWxlY3RlZEl0ZW1Db3VudH1gO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmNoZWNrQnV0dG9uQ291bnRzKGlzSW5pdGlhbClcbiAgICBcbiAgfVxuICBcbiAgY2hlY2tCdXR0b25Db3VudHMoaXNJbml0aWFsKXtcbiAgICB0aGlzLmZpbHRlclZhbHVlcyA9IHRoaXMuaW5pdEZpbHRlckNvdW50KHRoaXMuZmlsdGVyVmFsdWVzLCBpc0luaXRpYWwpO1xuICAgIHRoaXMucG9wdWxhdGVDb3VudGVycyh0aGlzLmZpbHRlclZhbHVlcyk7XG5cbiAgfVxuICBcbiAgXG4gIC8qKlxuICAqIGNoZWNrVmlzaWJpbGl0eSAtIFRlc3RzIGlmIGF0dHJpYnV0ZSBpcyBpbmNsdWRlZCBpbiBsaXN0LlxuICAqLyBcbiAgY2hlY2tWaXNpYmlsaXR5KGxpc3QsIGRhdGFBdHRyKSB7XG4gICAgLyogUmV0dXJucyBUUlVFIGlmIGxpc3QgaXMgZW1wdHkgb3IgYXR0cmlidXRlIGlzIGluIGxpc3QgKi8gICBcbiAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IodmFyIHYgPSAwOyB2IDwgbGlzdC5sZW5ndGg7IHYrKyl7XG4gICAgICAgIHZhciBhcnIgPSBkYXRhQXR0ci5zcGxpdChcIiBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihlbCl7cmV0dXJuIGVsLmxlbmd0aCA+IDB9KTtcbiAgICAgICAgaWYoYXJyLmluZGV4T2YobGlzdFt2XSkgPj0wICkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZSBcbiAgICB9XG4gIH1cbiAgXG4gIGFkZENsYXNzSWZNaXNzaW5nKGVsLCBjbikge1xuICAgIGlmKCFlbC5jbGFzc0xpc3QuY29udGFpbnMoY24pKSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGNuKTtcbiAgICB9IFxuICB9XG4gIFxuICBkZWxDbGFzc0lmUHJlc2VudChlbCwgY24pIHtcbiAgICBpZihlbC5jbGFzc0xpc3QuY29udGFpbnMoY24pKSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNuKVxuICAgIH0gXG4gIH1cbn1cblxud2luZG93WydIdWdvVGFnc0ZpbHRlciddID0gSHVnb1RhZ3NGaWx0ZXI7XG4iXX0=
