/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'PirsibIconFont\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-logo': '&#xe900;',
		'icon-lightning': '&#xe901;',
		'icon-yandex': '&#xe902;',
		'icon-plus': '&#xe903;',
		'icon-chevron-left': '&#xe904;',
		'icon-download': '&#xe905;',
		'icon-max': '&#xe906;',
		'icon-ozon': '&#xe907;',
		'icon-wb': '&#xe908;',
		'icon-phone-min': '&#xe909;',
		'icon-mail-min': '&#xe90a;',
		'icon-book': '&#xe90b;',
		'icon-telegram-hover': '&#xe90c;',
		'icon-whatsapp-hover': '&#xe90d;',
		'icon-mail': '&#xe90e;',
		'icon-user': '&#xe90f;',
		'icon-phone': '&#xe910;',
		'icon-location': '&#xe911;',
		'icon-gis': '&#xe912;',
		'icon-chevron-min': '&#xe913;',
		'icon-play': '&#xe914;',
		'icon-vk': '&#xe915;',
		'icon-chevron': '&#xe916;',
		'icon-telegram': '&#xe917;',
		'icon-whatsapp': '&#xe918;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
