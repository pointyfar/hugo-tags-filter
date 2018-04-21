(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @name 'Hugo Tags Filter'
 * @version 1.0.0
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
      if (document.getElementById("selectedItemCount")) {
        document.getElementById("selectedItemCount").textContent = '' + this.selectedItemCount;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaHVnb3RhZ3NmaWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQTs7Ozs7OztJQU9NLGM7QUFDSiwwQkFBWSxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLFFBQUksaUJBQWlCLENBQ25CO0FBQ0UsWUFBTSxLQURSO0FBRUUsY0FBUSxNQUZWO0FBR0UsbUJBQWEsWUFIZjtBQUlFLG1CQUFhLGtCQUpmO0FBS0UsZ0JBQVU7QUFMWixLQURtQixFQVFuQjtBQUNFLFlBQU0sU0FEUjtBQUVFLGNBQVEsTUFGVjtBQUdFLG1CQUFhLFlBSGY7QUFJRSxtQkFBYSxzQkFKZjtBQUtFLGdCQUFVO0FBTFosS0FSbUIsQ0FBckI7O0FBaUJBLFNBQUssT0FBTCxHQUFnQixVQUFVLE9BQU8sT0FBbEIsR0FBNkIsT0FBTyxPQUFwQyxHQUE4QyxjQUE3RDtBQUNBLFNBQUssYUFBTCxHQUFzQixVQUFVLE9BQU8sYUFBbEIsR0FBbUMsT0FBTyxhQUExQyxHQUEwRCxTQUEvRTtBQUNBLFNBQUssaUJBQUwsR0FBMEIsVUFBVSxPQUFPLGlCQUFsQixHQUF1QyxPQUFPLGlCQUE5QyxHQUFrRSxRQUEzRjtBQUNBLFNBQUssZUFBTCxHQUF3QixVQUFVLE9BQU8sZUFBbEIsR0FBcUMsT0FBTyxlQUE1QyxHQUE4RCxnQkFBckY7O0FBRUEsU0FBSyxXQUFMLEdBQW1CLFNBQVMsc0JBQVQsQ0FBZ0MsS0FBSyxlQUFyQyxDQUFuQjtBQUNBLFNBQUssaUJBQUwsR0FBeUIsQ0FBekI7O0FBRUEsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssT0FBTCxDQUFhLE1BQWpDLEVBQXlDLEdBQXpDLEVBQThDO0FBQzVDLFdBQUssT0FBTCxDQUFhLENBQWIsRUFBZ0IsYUFBaEIsSUFBaUMsU0FBUyxzQkFBVCxDQUFnQyxLQUFLLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLGFBQWhCLENB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OUI7QUFDQSxVQUFJLEtBQUssTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQ25CLGFBQUksSUFBSSxJQUFJLENBQVosRUFBZSxJQUFJLEtBQUssTUFBeEIsRUFBZ0MsR0FBaEMsRUFBb0M7QUFDbEMsY0FBRyxTQUFTLE9BQVQsQ0FBaUIsS0FBSyxDQUFMLENBQWpCLEtBQTRCLENBQS9CLEVBQW1DO0FBQ2pDLG1CQUFPLElBQVA7QUFDRDtBQUNGO0FBQ0QsZUFBTyxLQUFQO0FBQ0QsT0FQRCxNQU9PO0FBQ0wsZUFBTyxJQUFQO0FBQ0Q7QUFDRjs7O3NDQUVpQixFLEVBQUksRSxFQUFJO0FBQ3hCLFVBQUcsQ0FBQyxHQUFHLFNBQUgsQ0FBYSxRQUFiLENBQXNCLEVBQXRCLENBQUosRUFBK0I7QUFDN0IsV0FBRyxTQUFILENBQWEsR0FBYixDQUFpQixFQUFqQjtBQUNEO0FBQ0Y7OztzQ0FFaUIsRSxFQUFJLEUsRUFBSTtBQUN4QixVQUFHLEdBQUcsU0FBSCxDQUFhLFFBQWIsQ0FBc0IsRUFBdEIsQ0FBSCxFQUE4QjtBQUM1QixXQUFHLFNBQUgsQ0FBYSxNQUFiLENBQW9CLEVBQXBCO0FBQ0Q7QUFDRjs7Ozs7O0FBR0gsT0FBTyxnQkFBUCxJQUEyQixjQUEzQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQG5hbWUgJ0h1Z28gVGFncyBGaWx0ZXInXG4gKiBAdmVyc2lvbiAxLjAuMFxuICogQGxpY2Vuc2UgTUlUICBcbiAqIEBhdXRob3IgUG9pbnR5RmFyIFxuICovIFxuXG5jbGFzcyBIdWdvVGFnc0ZpbHRlciB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIHZhciBkZWZhdWx0RmlsdGVycyA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3RhZycsXG4gICAgICAgIHByZWZpeDogJ3RmdC0nLFxuICAgICAgICBidXR0b25DbGFzczogJ3RmdC1idXR0b24nLFxuICAgICAgICBhbGxTZWxlY3RvcjogJyN0ZlNlbGVjdEFsbFRhZ3MnLFxuICAgICAgICBhdHRyTmFtZTogJ2RhdGEtdGFncydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdzZWN0aW9uJyxcbiAgICAgICAgcHJlZml4OiAndGZzLScsXG4gICAgICAgIGJ1dHRvbkNsYXNzOiAndGZzLWJ1dHRvbicsXG4gICAgICAgIGFsbFNlbGVjdG9yOiAnI3RmU2VsZWN0QWxsU2VjdGlvbnMnLFxuICAgICAgICBhdHRyTmFtZTogJ2RhdGEtc2VjdGlvbidcbiAgICAgIH0sXG4gICAgXVxuICAgIFxuICAgIHRoaXMuRklMVEVSUyA9IChjb25maWcgJiYgY29uZmlnLmZpbHRlcnMpID8gY29uZmlnLmZpbHRlcnMgOiBkZWZhdWx0RmlsdGVycztcbiAgICB0aGlzLnNob3dJdGVtQ2xhc3MgPSAoY29uZmlnICYmIGNvbmZpZy5zaG93SXRlbUNsYXNzKSA/IGNvbmZpZy5zaG93SXRlbUNsYXNzIDogXCJ0Zi1zaG93XCI7XG4gICAgdGhpcy5hY3RpdmVCdXR0b25DbGFzcyA9IChjb25maWcgJiYgY29uZmlnLmFjdGl2ZUJ1dHRvbkNsYXNzKSA/IGNvbmZpZy5hY3RpdmVCdXR0b25DbGFzcyA6IFwiYWN0aXZlXCI7XG4gICAgdGhpcy5maWx0ZXJJdGVtQ2xhc3MgPSAoY29uZmlnICYmIGNvbmZpZy5maWx0ZXJJdGVtQ2xhc3MpID8gY29uZmlnLmZpbHRlckl0ZW1DbGFzcyA6IFwidGYtZmlsdGVyLWl0ZW1cIjtcbiAgICBcbiAgICB0aGlzLmZpbHRlckl0ZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLmZpbHRlckl0ZW1DbGFzcyk7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1Db3VudCA9IDA7XG4gICAgXG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuRklMVEVSU1tpXVsnYnV0dG9uVG90YWwnXSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5GSUxURVJTW2ldWydidXR0b25DbGFzcyddKS5sZW5ndGg7XG4gICAgICB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10gPSBbXTtcbiAgICB9XG4gICAgdGhpcy5zaG93Q2hlY2sodGhpcy5GSUxURVJTWzBdWyduYW1lJ10pO1xuXG4gIH1cbiAgXG4gIHNob3dBbGwoZmlsdGVyKSB7XG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKGZpbHRlcikge1xuICAgICAgICBpZih0aGlzLkZJTFRFUlNbaV1bJ25hbWUnXSA9PT0gZmlsdGVyKSB7XG4gICAgICAgICAgdGhpcy5GSUxURVJTW2ldWydzZWxlY3RlZCddID0gW107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXSA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNob3dDaGVjayhmaWx0ZXIpXG4gIH1cbiAgXG4gIGNoZWNrRmlsdGVyKHRhZywgdGFnVHlwZSkge1xuICAgIFxuICAgIC8qIFNlbGVjdHMgY2xpY2tlZCBidXR0b24uKi8gICBcbiAgICB2YXIgc2VsZWN0ZWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHt0YWdUeXBlfSR7dGFnfWApO1xuICAgIFxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuRklMVEVSUy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGlmICggdGhpcy5GSUxURVJTW2ldWydwcmVmaXgnXSA9PT0gdGFnVHlwZSApIHtcbiAgICAgICAgaWYgKCB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10uaW5kZXhPZih0YWcpID49IDAgKSB7IFxuICAgICAgICAgIC8qIGFscmVhZHkgc2VsZWN0ZWQsIGRlc2VsZWN0IHRhZyAqL1xuICAgICAgICAgIHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXS5zcGxpY2UodGFnLDEpO1xuICAgICAgICAgIHRoaXMuZGVsQ2xhc3NJZlByZXNlbnQoc2VsZWN0ZWRCdG4sIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpO1xuICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAvKiBhZGQgdGFnIHRvIHNlbGVjdGVkIGxpc3QgKi9cbiAgICAgICAgICB0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10ucHVzaCh0YWcpO1xuICAgICAgICAgIHRoaXMuYWRkQ2xhc3NJZk1pc3Npbmcoc2VsZWN0ZWRCdG4sIHRoaXMuYWN0aXZlQnV0dG9uQ2xhc3MpO1xuICAgICAgICB9IFxuICAgICAgICB0aGlzLmRlbENsYXNzSWZQcmVzZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5GSUxURVJTW2ldWydhbGxTZWxlY3RvciddKSwgdGhpcy5hY3RpdmVCdXR0b25DbGFzcyk7XG4gICAgICAgIHRoaXMuc2hvd0NoZWNrKHRoaXMuRklMVEVSU1tpXVsnbmFtZSddKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIC8qKlxuICAqIHNob3dDaGVjayAtIEFwcGxpZXMgXCJzaG93XCIgY2xhc3MgdG8gaXRlbXMgY29udGFpbmluZyBzZWxlY3RlZCB0YWdzXG4gICovIFxuICBzaG93Q2hlY2soZmlsdGVyKSB7XG4gICAgXG4gICAgLyogSWYgbm8gdGFncy9saWNlbnNlcyBzZWxlY3RlZCwgb3IgYWxsIHRhZ3Mgc2VsZWN0ZWQsIFNIT1cgQUxMIGFuZCBERVNFTEVDVCBBTEwgQlVUVE9OUy4gKi8gICBcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiggdGhpcy5GSUxURVJTW2ldWyduYW1lJ10gPT09IGZpbHRlciApIHtcbiAgICAgICAgaWYoICh0aGlzLkZJTFRFUlNbaV1bJ3NlbGVjdGVkJ10ubGVuZ3RoID09PSAwKSB8fCBcbiAgICAgICAgKHRoaXMuRklMVEVSU1tpXVsnc2VsZWN0ZWQnXS5sZW5ndGggPT09IHRoaXMuRklMVEVSU1tpXVsnYnV0dG9uVG90YWwnXSkgKSBcbiAgICAgICAgeyAgXG4gICAgICAgICAgdmFyIGlCdG5zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLkZJTFRFUlNbaV1bJ2J1dHRvbkNsYXNzJ10pO1xuICAgICAgICAgIGZvciAoIGogPSAwOyBqIDwgaUJ0bnMubGVuZ3RoOyBqKysgKSB7XG4gICAgICAgICAgICB0aGlzLmRlbENsYXNzSWZQcmVzZW50KGlCdG5zW2pdLCB0aGlzLmFjdGl2ZUJ1dHRvbkNsYXNzKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmFkZENsYXNzSWZNaXNzaW5nKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5GSUxURVJTW2ldWydhbGxTZWxlY3RvciddKSwgdGhpcy5hY3RpdmVCdXR0b25DbGFzcylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBcbiAgICB0aGlzLnNlbGVjdGVkSXRlbUNvdW50PTA7XG4gICAgXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJJdGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIC8qIEZpcnN0IHJlbW92ZSBcInNob3dcIiBjbGFzcyAqL1xuICAgICAgdGhpcy5kZWxDbGFzc0lmUHJlc2VudCh0aGlzLmZpbHRlckl0ZW1zW2ldLCB0aGlzLnNob3dJdGVtQ2xhc3MpO1xuICAgICAgXG4gICAgICB2YXIgdmlzaWJpbGl0eSA9IDA7XG4gICAgICAvKiBzaG93IGl0ZW0gb25seSBpZiB2aXNpYmlsaXR5IGlzIHRydWUgZm9yIGFsbCBmaWx0ZXJzICovXG4gICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCB0aGlzLkZJTFRFUlMubGVuZ3RoOyBqKysgKSB7XG4gICAgICAgIGlmICggdGhpcy5jaGVja1Zpc2liaWxpdHkodGhpcy5GSUxURVJTW2pdWydzZWxlY3RlZCddLCB0aGlzLmZpbHRlckl0ZW1zW2ldLmdldEF0dHJpYnV0ZSh0aGlzLkZJTFRFUlNbal1bJ2F0dHJOYW1lJ10pKSApIHtcbiAgICAgICAgICB2aXNpYmlsaXR5Kys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8qIFRoZW4gY2hlY2sgaWYgXCJzaG93XCIgY2xhc3Mgc2hvdWxkIGJlIGFwcGxpZWQgKi9cbiAgICAgIGlmICggdmlzaWJpbGl0eSA9PT0gdGhpcy5GSUxURVJTLmxlbmd0aCApIHtcbiAgICAgICAgaWYgKCAhdGhpcy5maWx0ZXJJdGVtc1tpXS5jbGFzc0xpc3QuY29udGFpbnModGhpcy5zaG93SXRlbUNsYXNzKSApIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbUNvdW50Kys7XG4gICAgICAgICAgdGhpcy5hZGRDbGFzc0lmTWlzc2luZyh0aGlzLmZpbHRlckl0ZW1zW2ldLCB0aGlzLnNob3dJdGVtQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0ZWRJdGVtQ291bnRcIikpIHtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0ZWRJdGVtQ291bnRcIikudGV4dENvbnRlbnQ9YCR7dGhpcy5zZWxlY3RlZEl0ZW1Db3VudH1gO1xuICAgIH1cbiAgICBcbiAgfVxuICBcbiAgXG4gIFxuICAvKipcbiAgKiBjaGVja1Zpc2liaWxpdHkgLSBUZXN0cyBpZiBhdHRyaWJ1dGUgaXMgaW5jbHVkZWQgaW4gbGlzdC5cbiAgKi8gXG4gIGNoZWNrVmlzaWJpbGl0eShsaXN0LCBkYXRhQXR0cikge1xuICAgIC8qIFJldHVybnMgVFJVRSBpZiBsaXN0IGlzIGVtcHR5IG9yIGF0dHJpYnV0ZSBpcyBpbiBsaXN0ICovICAgXG4gICAgaWYgKGxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgZm9yKHZhciB2ID0gMDsgdiA8IGxpc3QubGVuZ3RoOyB2Kyspe1xuICAgICAgICBpZihkYXRhQXR0ci5pbmRleE9mKGxpc3Rbdl0pID49MCApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWUgXG4gICAgfVxuICB9XG4gIFxuICBhZGRDbGFzc0lmTWlzc2luZyhlbCwgY24pIHtcbiAgICBpZighZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNuKSkge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbik7XG4gICAgfSBcbiAgfVxuICBcbiAgZGVsQ2xhc3NJZlByZXNlbnQoZWwsIGNuKSB7XG4gICAgaWYoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNuKSkge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbilcbiAgICB9IFxuICB9XG59XG5cbndpbmRvd1snSHVnb1RhZ3NGaWx0ZXInXSA9IEh1Z29UYWdzRmlsdGVyO1xuIl19
