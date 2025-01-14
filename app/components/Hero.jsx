// import React from 'react';
// import {useRef} from 'react';
// import gsap from 'gsap';
// import {useGSAP} from '@gsap/react';
// import {Await, Link} from '@remix-run/react';
// import {Suspense} from 'react';
// import {Image, Money} from '@shopify/hydrogen';
// import {ScrollTrigger} from 'gsap/dist/ScrollTrigger.js';

// gsap.registerPlugin(useGSAP);

// export const Hero = ({products}) => {
//   useGSAP(() => {
//     if (typeof document !== 'undefined') {
//       console.log(document);
//       gsap.registerPlugin(useGSAP, ScrollTrigger);
//     }
//     const ctx = gsap.context((self) => {
//       let mm = gsap.matchMedia();
//       mm.add('(min-width: 1024px)', (context) => {
//         const products = gsap.utils.toArray('.recommended-product');
//         console.log('products', products);
//         const container = document.querySelector('.index-container');

//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: '.hero-products-container',
//             start: 'top-=40 top',
//             scrub: true,
//             end: '+=4000px',
//             pin: true,
//             markers: true,
//             endTrigger: '.hero-products-inner-container',
//           },
//         });

//         products.forEach((pd, index) => {
//           // Get container width
//           const containerWidth = container?.clientWidth;
//           console.log(containerWidth);
//           const spacing = containerWidth / (products.length + 1);
//           console.log(spacing);
//           const xPosition = spacing * (index + 1);
//           console.log('xPosition', xPosition);
//           // Set initial zIndex and position
//           gsap.set(pd, {
//             zIndex: products.length - index,
//             position: 'absolute',
//             x: xPosition,
//           });

//           tl.fromTo(
//             pd,
//             {y: '100vh', ease: 'power1.inOut', scrub: 2},
//             {
//               y: 0,
//               scrub: 2,
//               ease: 'power1.in',
//               invalidateOnRefresh: true,
//               // start: () => (index ? 'top bottom' : 'top top'),
//               // end: 'bottom top',
//             },
//             `-=${0.5 * index}`, // Overlap animations slightly
//           );
//         });
//       });
//     });
//     return () => ctx.revert();
//   });

//   const scalesRef = useRef([]);
//   return (
//     <div className="hero-products-container">
//       <Suspense fallback={<div>Loading...</div>}>
//         <Await resolve={products}>
//           {(response) => (
//             <div className="hero-products-inner-container">
//               {response
//                 ? response.products.nodes.map((product, index) => (
//                     <Link
//                       key={product.id}
//                       className="recommended-product"
//                       to={`/products/${product.handle}`}
//                     >
//                       <Image
//                         data={product.images.nodes[0]}
//                         aspectRatio="5/7"
//                         sizes="(min-width: 45em) 20vw, 50vw"
//                       />
//                       <h4>{product.title}</h4>
//                       <small>
//                         <Money data={product.priceRange.minVariantPrice} />
//                       </small>
//                     </Link>
//                   ))
//                 : null}
//             </div>
//           )}
//         </Await>
//       </Suspense>
//       <br />
//     </div>
//   );
// };

import React, {useRef} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {Await, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger.js';

gsap.registerPlugin(useGSAP);

gsap.registerPlugin(ScrollTrigger);

export const Hero = ({products}) => {
  const scalesRef = useRef([]);

  const BASE_WIDTH = 300; // Base width in pixels

  const getRandomPosition = (max) => Math.random() * max; // Helper to get random position within a range

  useGSAP(() => {
    const ctx = gsap.context((self) => {
      let mm = gsap.matchMedia();
      const products = gsap.utils.toArray('.recommended-product');
      const container = document.querySelector('.index-container');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero-products-container',
          start: 'top top',
          scrub: true,
          end: '+=8000px',
          pin: true,
          markers: true,
          endTrigger: '.hero-products-inner-container',
        },
      });

      products.forEach((pd, index) => {
        const containerWidth = container?.clientWidth || window.innerWidth;
        const spacing = containerWidth / (products.length + 1);

        const randomX = getRandomPosition(containerWidth - BASE_WIDTH);
        const randomY = getRandomPosition(window.innerHeight - BASE_WIDTH);

        gsap.set(pd, {
          zIndex: products.length - index,
          position: 'absolute',
          x: randomX,
          y: randomY,
          scale: scalesRef.current[index],
        });

        tl.fromTo(
          pd,
          {y: window.innerHeight, ease: 'power1.inOut', scrub: 2},
          {
            y: randomY,
            x: randomX,
            ease: 'power1.in',
            duration: 0.5, // Duration per image
            stagger: 0.5, // Delay between animations for each image
            invalidateOnRefresh: true,
          },
          `-=${0.3 * index}`,
        );
      });
    });

    return () => ctx.revert();
  });

  // Generate random scales between 0.7 and 1 for subtler size differences
  const getRandomScale = () => Math.random() * (1 - 0.7) + 0.7;

  return (
    <div className="hero-products-container">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="hero-products-inner-container">
              <h4 className="absolute inset-0 flex items-center justify-center">
                Scroll down
              </h4>
              {response
                ? response.products.nodes.map((product, index) => {
                    if (!scalesRef.current[index]) {
                      scalesRef.current[index] = getRandomScale();
                    }

                    return (
                      <Link
                        key={product.id}
                        className="recommended-product bg-white border-black border-2"
                        to={`/products/${product.handle}`}
                        style={{
                          maxWidth: `${BASE_WIDTH}px`,
                          width: '100%',
                        }}
                        // style={{
                        //   transform: `scale(${scalesRef.current[index]})`,
                        // }}
                      >
                        <Image
                          data={product.images.nodes[0]}
                          aspectRatio="5/7"
                          sizes={`(min-width: 45em) ${BASE_WIDTH}px, 100vw`}
                        />
                        <h4>{product.title}</h4>
                        <small>
                          <Money data={product.priceRange.minVariantPrice} />
                        </small>
                      </Link>
                    );
                  })
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
};
