/*
|--------------------------------------------------------------------
| Manualy creating scroll logic
|--------------------------------------------------------------------
*/
const maxY = document.documentElement.scrollHeight - window.innerHeight;
let horizontalSections = null;

// Interconnected variables -________________________________________
let virtualY = 0;
let lastTouchY = null;
let lastMoveTime = null;
let inheritDeltaY = null; // Used for touch acceleration

// Points horizontal handling
let horizontalMode = false;

// Tracking cursor/touch scroll _____________________________________
function onWheel(e) {
    e.preventDefault();
    applyDelta(e.deltaY);
}

function onTouchStart(e) {
    if (e.touches.length === 1) {
        lastTouchY = e.touches[0].screenY; 
    }
}

function onTouchMove(e) {
    if (e.touches.length === 1 && lastTouchY !== null) {
        e.preventDefault();

        const currentTouchY = e.touches[0].screenY;

        inheritDeltaY = lastTouchY - currentTouchY;

        applyDelta(inheritDeltaY);

        lastTouchY = currentTouchY;
    }
}

function onTouchEnd(e) {
    if (!inheritDeltaY) return;

    let velocity = inheritDeltaY;
    const friction = 0.95;
    const minVelocity = 0.5;

    function momentumScroll() {
        if (Math.abs(velocity) > minVelocity) {
            applyDelta(velocity);
            velocity *= friction;
            requestAnimationFrame(momentumScroll);
        }
    }
    requestAnimationFrame(momentumScroll);

    inheritDeltaY = null;
    lastTouchY = null;
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
function applyDeltaX(wrapper, delta) {
    if (delta == 0) return;

    const scroller = wrapper.e.querySelector('.x-scroller');

    const movingRight = delta > 0;
    const movingLeft = delta < 0;

    const newX = scroller.scrollLeft + delta;

    if (movingRight) {
        const maxScroll = scroller.scrollWidth - scroller.clientWidth;

        scroller.scrollLeft = Math.min(newX, maxScroll);
        virtualY = Math.max(virtualY + (newX - maxScroll), wrapper.y);

    } else if (movingLeft) {
        const minScroll = 0;

        scroller.scrollLeft = Math.max(newX, 0);
        virtualY = Math.min(virtualY + newX, wrapper.y);
    }
}

function applyDelta(delta) {
    const movingDown = delta > 0;
    const movingUp = delta < 0;

    const { less, great } = findClosests(horizontalSections);
    const newY = virtualY + delta;


    if (movingDown && great !== null) {
        virtualY = Math.min(newY, great.y);
        applyDeltaX(great, Math.max(newY - great.y, 0));
    } else if (movingUp && less !== null) { 
        virtualY = Math.max(newY, less.y);
        applyDeltaX(less, Math.min(newY - less.y, 0))
    } else {
        virtualY = newY
    }

    // Cap to 0 on negative numbers
    if (virtualY < 0) virtualY = 0;
    // Cap max y
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
    horizontalSections = getHorizontalSectionsY();

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