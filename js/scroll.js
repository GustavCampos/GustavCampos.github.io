/*
|--------------------------------------------------------------------
| Manualy creating scroll logic
|--------------------------------------------------------------------
*/
// Interconnected variables -________________________________________
let virtualY = 0;
let lastTouchY = null;
let lastTouchX = null;
let lastMoveTime = null;
let inheritDeltaY = null; // Used for touch acceleration
let inheritDeltaX = null; // Used for touch acceleration

// Points horizontal handling
let horizontalMode = false;

// Tracking cursor/touch scroll _____________________________________
function onWheel(e) {
    e.preventDefault();
    applyDeltaY(e.deltaY);
}

function onTouchStart(e) {
    if (e.touches.length === 1) {
        lastTouchY = e.touches[0].screenY;
        lastTouchX = e.touches[0].screenX;
    }
}

function onTouchMove(e) {
    if (e.touches.length === 1 && lastTouchY !== null && lastTouchX !== null) {
        e.preventDefault();

        const currentTouchY = e.touches[0].screenY;
        const currentTouchX = e.touches[0].screenX;

        inheritDeltaY = lastTouchY - currentTouchY;
        inheritDeltaX = lastTouchX - currentTouchX;

        // Prefer horizontal scroll
        if (Math.abs(inheritDeltaX) >= Math.abs(inheritDeltaY)) {
            applyDeltaX(inheritDeltaX);
        } else {
            applyDeltaY(inheritDeltaY);
        }
        

        lastTouchY = currentTouchY;
        lastTouchX = currentTouchX;
    }
}

function onTouchEnd(e) {
    const friction = 0.95;
    const minVelocity = 0.5;
    let direction = null;
    let velocity;

    if (inheritDeltaY) {
        direction = 'y';
        velocity = inheritDeltaY;

    } else if (inheritDeltaX) {
        direction = 'x';
        velocity = inheritDeltaX;

    } else {return;}


    function momentumScroll() {
        if (Math.abs(velocity) > minVelocity) {
            if (direction === 'y') {
                applyDeltaY(velocity);
            } else {applyDeltaX(velocity);}

            velocity *= friction;
            requestAnimationFrame(momentumScroll);
        }
    }
    requestAnimationFrame(momentumScroll);

    inheritDeltaY = null;
    inheritDeltaX = null;
    lastTouchY = null;
    lastTouchX = null;
}

// Handling horizontal sections _____________________________________
/**
 * @returns {Array<{wrapper, wrapperY}>}
 */
function getHorizontalSectionsY() {
    const wrappers = document.querySelectorAll('[data-x-wrapper]');
    const returnArray = [];

    wrappers.forEach(wrapper => {
        const wrapperY = wrapper.getBoundingClientRect().top + window.scrollY;
        returnArray.push({ e: wrapper, y: wrapperY});
    });

    return returnArray;
}

function findClosests(wrappers) {
    let less = null;
    let great = null;

    for (const wrapper of wrappers) {
        if (wrapper.y <= virtualY && (less === null || less.y < wrapper.y)) {less = wrapper}
        if (wrapper.y >= virtualY && (great === null || great.y > wrapper.y)) {great = wrapper}
    }
    return { less, great };
}

// Scrolling screen _________________________________________________
function applyDeltaOnXWrapper(wrapper, delta) {
    if (delta == 0) return;

    const scroller = wrapper.e.querySelector('.x-scroller');
    const progress = wrapper.e.querySelector('[data-x-progress]');

    const movingRight = delta > 0;
    const movingLeft = delta < 0;

    const newX = scroller.scrollLeft + delta;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;

    if (movingRight) {
        scroller.scrollLeft = Math.min(newX, maxScroll);
        virtualY = Math.max(virtualY + (newX - maxScroll), wrapper.y);
    } else if (movingLeft) {
        scroller.scrollLeft = Math.max(newX, 0);
        virtualY = Math.min(virtualY + newX, wrapper.y);
    }

    if (progress) {
        progress.value = Math.round((scroller.scrollLeft / maxScroll) * 100);
    }
}

function applyDeltaX(delta) {
    if (delta === 0) return;

    const movingLeft = delta < 0;
    
    const { less, great } = findClosests(getHorizontalSectionsY());
    const onScrollSection = less === great;

    if (onScrollSection) {
        const scroller = less.e.querySelector('.x-scroller');
        
        const newX = scroller.scrollLeft + delta;
        const maxScroll = scroller.scrollWidth - scroller.clientWidth;

        if (movingLeft) {
            scroller.scrollLeft = Math.max(0, newX);
        } else {
            scroller.scrollLeft = Math.min(newX, maxScroll);
        }

        const progress = less.e.querySelector('[data-x-progress]')
        if (progress) {
            progress.value = Math.round((scroller.scrollLeft / maxScroll) * 100);
        }
    }
}

function applyDeltaY(delta) {
    if (delta === 0) return;

    const movingDown = delta > 0;
    const movingUp = delta < 0;
    
    const { less, great } = findClosests(getHorizontalSectionsY());
    const newY = virtualY + delta;

    if (movingDown && great !== null) {
        virtualY = Math.min(newY, great.y);
        applyDeltaOnXWrapper(great, Math.max(newY - great.y, 0));
    } else if (movingUp && less !== null) { 
        virtualY = Math.max(newY, less.y);
        applyDeltaOnXWrapper(less, Math.min(newY - less.y, 0))
    } else {
        virtualY = newY
    }

    // Cap to 0 on negative numbers
    if (virtualY < 0) virtualY = 0;
    
    // Cap max y
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    if (virtualY > maxY) virtualY = maxY;
}

function scroll() {
    window.scrollTo(0, virtualY);
    requestAnimationFrame(scroll);
}

function smoothScroll(targetY) {
    const duration = 500;
    const startY = virtualY;
    const deltaY = targetY - startY;
    const startTime = performance.now();

    const animate = () => {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;

        const progress = Math.min((elapsed / duration), 1);

        // Cubic animation
        const ease = 1 - Math.pow(1 - progress, 3);

        virtualY = startY + (deltaY * ease);

        if (progress < 1) {requestAnimationFrame(animate)}
    }
    requestAnimationFrame(animate);
}

// Registering events window events _______________________________________________
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    requestAnimationFrame(scroll);
});

// Smoth scroll on anchors _________________________________________________________
document.addEventListener('DOMContentLoaded', () => {
    const anchors = document.querySelectorAll('a[href^="#"');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            event.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const targetY = target.getBoundingClientRect().top + window.scrollY;
                smoothScroll(targetY);
            }
        })
    });
});