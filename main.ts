import { Observable, Observer } from 'rxjs';
let dot = document.getElementById('dot');
let output = document.getElementById('output');
let button = document.getElementById('button');
let url = 'https://zebras-ek.herokuapp.com/zebras';

// let numbers = [1, 2, 3, 6, 7, 9];
// let source = Observable.from(numbers);

// class MyObserver implements Observer<number> {
    
//     next(v) {
//         console.log(`value: ${v}`);
//     }

//     error(e) {
//         console.log(`error: ${e}`);
//     }

//     complete() {
//         console.log('complete');
//     }
// }

// source.subscribe(new MyObserver());
// source.subscribe(new MyObserver());

// let source2 = Observable.create(observer => {

//     for (let n of numbers) {
//         if (n === 3) {
//             observer.error('Three is not allowed!');
//         }

//         observer.next(n);
//     }

//     observer.complete();
// });

// source2.subscribe(
//     v => console.log(v),
//     e => console.error(e),
//     () => console.log('complete')
// );


// let source3 = Observable.create(observer => {

//     let index = 0;
//     let produceValue = () => {
//         observer.next(numbers[index++]);

//         if (index < numbers.length) {
//             setTimeout(produceValue, 2000);
//         } else {
//             observer.complete();
//         }
//     }
// });

// source3.subscribe(
//     v => console.log(v),
//     e => console.error(e),
//     () => console.log('complete')
// );

let mouseEventsStream = Observable.fromEvent(document, 'mousemove')
    .map((e: MouseEvent) => {
        return {
            x: e.clientX,
            y: e.clientY
        }
    })
    // .filter(value => value.x < 1000)
    .delay(300);

mouseEventsStream.subscribe(
    v => moveDot(v),
    e => console.error(e),
    () => console.log('complete')
)

function moveDot(v){
    console.log(v);
    dot.style.left = (v.x - 30).toString();
    dot.style.top = (v.y - 30).toString();
}

let click = Observable.fromEvent(button, 'click');

function load(url: string){
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
        let zebras = JSON.parse(xhr.responseText);
        zebras.forEach(zebra => {
            let div = document.createElement('div');
            div.innerText = zebra.name;
            output.appendChild(div);
        });
    });
    xhr.open('GET', url);
    xhr.send();
} 

click.subscribe(
    e => load(url),
    e => console.error(e),
    () => console.log('complete')
);

