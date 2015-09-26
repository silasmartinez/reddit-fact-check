/**
 * Created by silasmartinez on 7/29/15.
 */

var boxes = document.getElementsByClassName('box');
var container = document.getElementsByClassName('main');

container[0].addEventListener('mouseover', function (e) {
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].classList.add('shrink');
  }
});

container[0].addEventListener('mouseout', function (e) {
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].classList.remove('shrink');
  }
});
