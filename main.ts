import { Observable, Observer } from 'rxjs';
let dot = document.getElementById('dot');
let output = document.getElementById('output');
let button = document.getElementById('button');
let url = 'https://zebras-ek.herokuapp.com/zebraxs';

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
    });
    // .filter(value => value.x < 1000)
    // .delay(300);

mouseEventsStream.subscribe(
    v => moveDot(v),
    e => console.error(e),
    () => console.log('complete')
)

function moveDot(v){
    console.log(v);
    dot.style.left = (v.x).toString();
    dot.style.top = (v.y).toString();
}

let click = Observable.fromEvent(button, 'click');

function load(url: string){
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                let zebras = JSON.parse(xhr.responseText);
                observer.next(zebras);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }

        });
        xhr.open('GET', url);
        xhr.send();
    })
    .retryWhen(retryStrategy());
} 


click.flatMap(e => load(url))
    .subscribe(
        renderZebras,
        e => console.error(e),
        () => console.log('complete')
    );

function renderZebras(zebras){
    zebras.forEach(zebra => {
        let div = document.createElement('div');
        div.innerText = zebra.name + ' from ' + zebra.location + ' with ' + zebra.stripes + ' stripes.';
        output.appendChild(div);
    });
}

function retryStrategy(){
    return function(errors){
        return errors
            .scan((acc, val) => {
                console.log(acc, val);
                return acc + 1;
            }, 0)
            .takeWhile(acc => acc < 4)
            .delay(1000);
    }
}