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

    this.filterItems = document.getElementsByClassName(this.filterItemClass);
    this.selectedItemCount = 0;

    for (var i = 0; i < this.FILTERS.length; i++) {
      this.FILTERS[i]['buttonTotal'] = document.getElementsByClassName(this.FILTERS[i]['buttonClass']).length;
      this.FILTERS[i]['selected'] = [];
    }
    this.showCheck(this.FILTERS[0]['name']);
  }

  _createClass(HugoTagsFilter, [{
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
    value: function showCheck(filter) {

      /* If no tags/licenses selected, or all tags selected, SHOW ALL and DESELECT ALL BUTTONS. */
      for (var i = 0; i < this.FILTERS.length; i++) {
        if (this.FILTERS[i]['name'] === filter) {
          if (this.FILTERS[i]['selected'].length === 0 || this.FILTERS[i]['selected'].length === this.FILTERS[i]['buttonTotal']) {
            var iBtns = document.getElementsByClassName(this.FILTERS[i]['buttonClass']);
            for (j = 0; j < iBtns.length; j++) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaHVnb3RhZ3NmaWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQTs7Ozs7OztJQU9NLGM7QUFDSiwwQkFBWSxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLFFBQUksaUJBQWlCLENBQ25CO0FBQ0UsWUFBTSxLQURSO0FBRUUsY0FBUSxNQUZWO0FBR0UsbUJBQWEsWUFIZjtBQUlFLG1CQUFhLGtCQUpmO0FBS0UsZ0JBQVU7QUFMWixLQURtQixFQVFuQjtBQUNFLFlBQU0sU0FEUjtBQUVFLGNBQVEsTUFGVjtBQUdFLG1CQUFhLFlBSGY7QUFJRSxtQkFBYSxzQkFKZjtBQUtFLGdCQUFVO0FBTFosS0FSbUIsQ0FBckI7O0FBaUJBLFNBQUssT0FBTCxHQUFnQixVQUFVLE9BQU8sT0FBbEIsR0FBNkIsT0FBTyxPQUFwQyxHQUE4QyxjQUE3RDtBQUNBLFNBQUssYUFBTCxHQUFzQixVQUFVLE9BQU8sYUFBbEIsR0FBbUMsT0FBTyxhQUExQyxHQUEwRCxTQUEvRTtBQUNBLFNBQUssaUJBQUwsR0FBMEIsVUFBVSxPQUFPLGlCQUFsQixHQUF1QyxPQUFPLGlCQUE5QyxHQUFrRSxRQUEzRjtBQUNBLFNBQUssZUFBTCxHQUF3QixVQUFVLE9BQU8sZUFBbEIsR0FBcUMsT0FBTyxlQUE1QyxHQUE4RCxnQkFBckY7QUFDQSxTQUFLLGVBQUwsR0FBd0IsVUFBVSxPQUFPLGVBQWxCLEdBQXFDLE9BQU8sZUFBNUMsR0FBOEQsbUJBQXJGOztBQUVBLFNBQUssV0FBTCxHQUFtQixTQUFTLHNCQUFULENBQWdDLEtBQUssZUFBckMsQ0FBbkI7QUFDQSxTQUFLLGlCQUFMLEdBQXlCLENBQXpCOztBQUVBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE9BQUwsQ0FBYSxNQUFqQyxFQUF5QyxHQUF6QyxFQUE4QztBQUM1QyxXQUFLLE9BQUwsQ0FBYSxDQUFiLEVB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RUFBOEMsV0FBOUMsUUFBNkQsS0FBSyxpQkFBbEU7QUFDRDtBQUVGOztBQUlEOzs7Ozs7b0NBR2dCLEksRUFBTSxRLEVBQVU7QUFDOUI7QUFDQSxVQUFJLEtBQUssTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQ25CLGFBQUksSUFBSSxJQUFJLENBQVosRUFBZSxJQUFJLEtBQUssTUFBeEIsRUFBZ0MsR0FBaEMsRUFBb0M7QUFDbEMsY0FBRyxTQUFTLE9BQVQsQ0FBaUIsS0FBSyxDQUFMLENBQWpCLEtBQTRCLENBQS9CLEVBQW1DO0FBQ2pDLG1CQUFPLElBQVA7QUFDRDtBQUNGO0FBQ0QsZUFBTyxLQUFQO0FBQ0QsT0FQRCxNQU9PO0FBQ0wsZUFBTyxJQUFQO0FBQ0Q7QUFDRjs7O3NDQUVpQixFLEVBQUksRSxFQUFJO0FBQ3hCLFVBQUcsQ0FBQyxHQUFHLFNBQUgsQ0FBYSxRQUFiLENBQXNCLEVBQXRCLENBQUosRUFBK0I7QUFDN0IsV0FBRyxTQUFILENBQWEsR0FBYixDQUFpQixFQUFqQjtBQUNEO0FBQ0Y7OztzQ0FFaUIsRSxFQUFJLEUsRUFBSTtBQUN4QixVQUFHLEdBQUcsU0FBSCxDQUFhLFFBQWIsQ0FBc0IsRUFBdEIsQ0FBSCxFQUE4QjtBQUM1QixXQUFHLFNBQUgsQ0FBYSxNQUFiLENBQW9CLEVBQXBCO0FBQ0Q7QUFDRjs7Ozs7O0FBR0gsT0FBTyxnQkFBUCxJQUEyQixjQUEzQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQG5hbWUgJ0h1Z28gVGFncyBGaWx0ZXInXG4gKiBAdmVyc2lvbiAxLjAuMVxuICogQGxpY2Vuc2UgTUlUICBcbiAqIEBhdXRob3IgUG9pbnR5RmFyIFxuICovIFxuXG5jbGFzcyBIdWdvVGFnc0ZpbHRlciB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIHZhciBkZWZhdWx0RmlsdGVycyA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3RhZycsXG4gICAgICAgIHByZWZpeDogJ3RmdC0nLFxuICAgICAgICBidXR0b25DbGFzczogJ3RmdC1idXR0b24nLFxuICAgICAgICBhbGxTZWxlY3RvcjogJyN0ZlNlbGVjdEFsbFRhZ3MnLFxuICAgICAgICBhdHRyTmFtZTogJ2RhdGEtdGFncydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdzZWN0aW9uJyxcbiAgICAgICAgcHJlZml4OiAndGZzLScsXG4gICAgICAgIGJ1dHRvbkNsYXNzOiAndGZzLWJ1dHRvbicsXG4gICAgICAgIGFsbFNlbGVjdG9yOiAnI3RmU2VsZWN0QWxsU2VjdGlvbnMnLFxuICAgICAgICBhdHRyTmFtZTogJ2RhdGEtc2VjdGlvbidcbiAgICAgIH1cbiAgICBdXG4gICAgXG4gICAgdGhpcy5GSUxURVJTID0gKGNvbmZpZyAmJiBjb25maWcuZmlsdGVycykgPyBjb25maWcuZmlsdGVycyA6IGRlZmF1bHRGaWx0ZXJzO1xuICAgIHRoaXMuc2hvd0l0ZW1DbGFzcyA9IChjb25maWcgJiYgY29uZmlnLnNob3dJdGVtQ2xhc3MpID8gY29uZmlnLnNob3dJdGVtQ2xhc3MgOiBcInRmLXNob3dcIjtcbiAgICB0aGlzLmFjdGl2ZUJ1dHRvbkNsYXNzID0gKGNvbmZpZyAmJiBjb25maWcuYWN0aXZlQnV0dG9uQ2xhc3MpID8gY29uZmlnLmFjdGl2ZUJ1dHRvbkNsYXNzIDogXCJhY3RpdmVcIjtcbiAgICB0aGlzLmZpbHRlckl0ZW1DbGFzcyA9IChjb25maWcgJiYgY29uZmlnLmZpbHRlckl0ZW1DbGFzcykgPyBjb25maWcuZmlsdGVySXRlbUNsYXNzIDogXCJ0Zi1maWx0ZXItaXRlbVwiO1xuICAgIHRoaXMuY291bnRlclNlbGVjdG9yID0gKGNvbmZpZyAmJiBjb25maWcuY291bnRlclNlbGVjdG9yKSA/IGNvbmZpZy5jb3VudGVyU2VsZWN0b3IgOiBcInNlbGVjdGVkSXRlbUNvdW50XCI7XG4gICAgXG4gICAgdGhpcy5maWx0ZXJJdGVtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5maWx0ZXJJdGVtQ2xhc3MpO1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtQ291bnQgPSAwO1xuICAgIFxuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5GSUxURVJTLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLkZJTFRFUlNbaV1bJ2J1dHRvblRvdGFsJ10gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMuRklMVEVSU1tpXVsnYnV0dG9uQ2xhc3MnXSkubGVuZ3RoO1xuICAgICAgdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddID0gW107XG4gICAgfVxuICAgIHRoaXMuc2hvd0NoZWNrKHRoaXMuRklMVEVSU1swXVsnbmFtZSddKTtcblxuICB9XG4gIFxuICBzaG93QWxsKGZpbHRlcikge1xuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGhpcy5GSUxURVJTLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZihmaWx0ZXIpIHtcbiAgICAgICAgaWYodGhpcy5GSUxURVJTW2ldWyduYW1lJ10gPT09IGZpbHRlcikge1xuICAgICAgICAgIHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXSA9IFtdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10gPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zaG93Q2hlY2soZmlsdGVyKVxuICB9XG4gIFxuICBjaGVja0ZpbHRlcih0YWcsIHRhZ1R5cGUpIHtcbiAgICBcbiAgICAvKiBTZWxlY3RzIGNsaWNrZWQgYnV0dG9uLiovICAgXG4gICAgdmFyIHNlbGVjdGVkQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7dGFnVHlwZX0ke3RhZ31gKTtcbiAgICBcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiAoIHRoaXMuRklMVEVSU1tpXVsncHJlZml4J10gPT09IHRhZ1R5cGUgKSB7XG4gICAgICAgIGlmICggdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddLmluZGV4T2YodGFnKSA+PSAwICkgeyBcbiAgICAgICAgICAvKiBhbHJlYWR5IHNlbGVjdGVkLCBkZXNlbGVjdCB0YWcgKi9cbiAgICAgICAgICB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10uc3BsaWNlKHRhZywxKTtcbiAgICAgICAgICB0aGlzLmRlbENsYXNzSWZQcmVzZW50KHNlbGVjdGVkQnRuLCB0aGlzLmFjdGl2ZUJ1dHRvbkNsYXNzKTtcbiAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgLyogYWRkIHRhZyB0byBzZWxlY3RlZCBsaXN0ICovXG4gICAgICAgICAgdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddLnB1c2godGFnKTtcbiAgICAgICAgICB0aGlzLmFkZENsYXNzSWZNaXNzaW5nKHNlbGVjdGVkQnRuLCB0aGlzLmFjdGl2ZUJ1dHRvbkNsYXNzKTtcbiAgICAgICAgfSBcbiAgICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuRklMVEVSU1tpXVsnYWxsU2VsZWN0b3InXSksIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpO1xuICAgICAgICB0aGlzLnNob3dDaGVjayh0aGlzLkZJTFRFUlNbaV1bJ25hbWUnXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgKiBzaG93Q2hlY2sgLSBBcHBsaWVzIFwic2hvd1wiIGNsYXNzIHRvIGl0ZW1zIGNvbnRhaW5pbmcgc2VsZWN0ZWQgdGFnc1xuICAqLyBcbiAgc2hvd0NoZWNrKGZpbHRlcikge1xuICAgIFxuICAgIC8qIElmIG5vIHRhZ3MvbGljZW5zZXMgc2VsZWN0ZWQsIG9yIGFsbCB0YWdzIHNlbGVjdGVkLCBTSE9XIEFMTCBhbmQgREVTRUxFQ1QgQUxMIEJVVFRPTlMuICovICAgXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5GSUxURVJTLmxlbmd0aDsgaSsrICkge1xuICAgICAgaWYoIHRoaXMuRklMVEVSU1tpXVsnbmFtZSddID09PSBmaWx0ZXIgKSB7XG4gICAgICAgIGlmKCAodGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddLmxlbmd0aCA9PT0gMCkgfHwgXG4gICAgICAgICh0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10ubGVuZ3RoID09PSB0aGlzLkZJTFRFUlNbaV1bJ2J1dHRvblRvdGFsJ10pICkgXG4gICAgICAgIHsgIFxuICAgICAgICAgIHZhciBpQnRucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5GSUxURVJTW2ldWydidXR0b25DbGFzcyddKTtcbiAgICAgICAgICBmb3IgKCBqID0gMDsgaiA8IGlCdG5zLmxlbmd0aDsgaisrICkge1xuICAgICAgICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudChpQnRuc1tqXSwgdGhpcy5hY3RpdmVCdXR0b25DbGFzcylcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hZGRDbGFzc0lmTWlzc2luZyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuRklMVEVSU1tpXVsnYWxsU2VsZWN0b3InXSksIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1Db3VudD0wO1xuICAgIFxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuZmlsdGVySXRlbXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAvKiBGaXJzdCByZW1vdmUgXCJzaG93XCIgY2xhc3MgKi9cbiAgICAgIHRoaXMuZGVsQ2xhc3NJZlByZXNlbnQodGhpcy5maWx0ZXJJdGVtc1tpXSwgdGhpcy5zaG93SXRlbUNsYXNzKTtcbiAgICAgIFxuICAgICAgdmFyIHZpc2liaWxpdHkgPSAwO1xuICAgICAgLyogc2hvdyBpdGVtIG9ubHkgaWYgdmlzaWJpbGl0eSBpcyB0cnVlIGZvciBhbGwgZmlsdGVycyAqL1xuICAgICAgZm9yICggdmFyIGogPSAwOyBqIDwgdGhpcy5GSUxURVJTLmxlbmd0aDsgaisrICkge1xuICAgICAgICBpZiAoIHRoaXMuY2hlY2tWaXNpYmlsaXR5KHRoaXMuRklMVEVSU1tqXVsnc2VsZWN0ZWQnXSwgdGhpcy5maWx0ZXJJdGVtc1tpXS5nZXRBdHRyaWJ1dGUodGhpcy5GSUxURVJTW2pdWydhdHRyTmFtZSddKSkgKSB7XG4gICAgICAgICAgdmlzaWJpbGl0eSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvKiBUaGVuIGNoZWNrIGlmIFwic2hvd1wiIGNsYXNzIHNob3VsZCBiZSBhcHBsaWVkICovXG4gICAgICBpZiAoIHZpc2liaWxpdHkgPT09IHRoaXMuRklMVEVSUy5sZW5ndGggKSB7XG4gICAgICAgIGlmICggIXRoaXMuZmlsdGVySXRlbXNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuc2hvd0l0ZW1DbGFzcykgKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1Db3VudCsrO1xuICAgICAgICAgIHRoaXMuYWRkQ2xhc3NJZk1pc3NpbmcodGhpcy5maWx0ZXJJdGVtc1tpXSwgdGhpcy5zaG93SXRlbUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvdW50ZXJTZWxlY3RvcikpIHtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY291bnRlclNlbGVjdG9yKS50ZXh0Q29udGVudD1gJHt0aGlzLnNlbGVjdGVkSXRlbUNvdW50fWA7XG4gICAgfVxuICAgIFxuICB9XG4gIFxuICBcbiAgXG4gIC8qKlxuICAqIGNoZWNrVmlzaWJpbGl0eSAtIFRlc3RzIGlmIGF0dHJpYnV0ZSBpcyBpbmNsdWRlZCBpbiBsaXN0LlxuICAqLyBcbiAgY2hlY2tWaXNpYmlsaXR5KGxpc3QsIGRhdGFBdHRyKSB7XG4gICAgLyogUmV0dXJucyBUUlVFIGlmIGxpc3QgaXMgZW1wdHkgb3IgYXR0cmlidXRlIGlzIGluIGxpc3QgKi8gICBcbiAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IodmFyIHYgPSAwOyB2IDwgbGlzdC5sZW5ndGg7IHYrKyl7XG4gICAgICAgIGlmKGRhdGFBdHRyLmluZGV4T2YobGlzdFt2XSkgPj0wICkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZSBcbiAgICB9XG4gIH1cbiAgXG4gIGFkZENsYXNzSWZNaXNzaW5nKGVsLCBjbikge1xuICAgIGlmKCFlbC5jbGFzc0xpc3QuY29udGFpbnMoY24pKSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGNuKTtcbiAgICB9IFxuICB9XG4gIFxuICBkZWxDbGFzc0lmUHJlc2VudChlbCwgY24pIHtcbiAgICBpZihlbC5jbGFzc0xpc3QuY29udGFpbnMoY24pKSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNuKVxuICAgIH0gXG4gIH1cbn1cblxud2luZG93WydIdWdvVGFnc0ZpbHRlciddID0gSHVnb1RhZ3NGaWx0ZXI7XG4iXX0=
