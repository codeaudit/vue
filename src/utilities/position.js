import * as Positions from './../Popover/Positions';

const centerAlignmentDivisor = 2;

export const getViewportPosition = () => ({
    height: window.document.documentElement.clientHeight,
    left: 0,
    top: 0,
    width: window.document.documentElement.clientWidth,
});

export const getPosition = (element) => {
    const el = element;
    const rect = el.getBoundingClientRect();
    const position = {
        height: el.offsetHeight,
        left: rect.left,
        top: rect.top,
        width: el.offsetWidth,
    };

    position.center = position.left + position.width / centerAlignmentDivisor;
    position.middle = position.top + position.height / centerAlignmentDivisor;

    return position;
};

export const isWithinLeftBoundary = (boundingPosition) => (position) => position.left >= boundingPosition.left;
export const isWithinRightBoundary = (boundingPosition) => (position) => position.left + position.width <= boundingPosition.left + boundingPosition.width;
export const isWithinXBoundary = (boundingPosition) => {
    const isWithinLeft = isWithinLeftBoundary(boundingPosition);
    const isWithinRight = isWithinRightBoundary(boundingPosition);

    return (position) => isWithinLeft(position) && isWithinRight(position);
};

export const isWithinTopBoundary = (boundingPosition) => (position) => position.top >= boundingPosition.top;
export const isWithinBottomBoundary = (boundingPosition) => (position) => (position.top + position.height) <= (boundingPosition.top + boundingPosition.height);
export const isWithinYBoundary = (boundingPosition) => {
    const isWithinTop = isWithinTopBoundary(boundingPosition);
    const isWithinBottom = isWithinBottomBoundary(boundingPosition);

    return (position) => isWithinTop(position) && isWithinBottom(position);
};

export const isWithinBoundary = (boundingPosition) => {
    const isWithinX = isWithinXBoundary(boundingPosition);
    const isWithinY = isWithinYBoundary(boundingPosition);

    return (position) => isWithinX(position) && isWithinY(position);
};

export const getUnion = (positionA, positionB) => {
    const left = Math.min(positionA.left, positionB.left);
    const top = Math.min(positionA.top, positionB.top);
    const width = Math.max(positionA.left + positionA.width, positionB.left + positionB.width) - left;
    const height = Math.max(positionA.top + positionA.height, positionB.top + positionB.height) - top;
    return {
        height,
        left,
        top,
        width,
    };
}

export const adjustPositionWithinBoundaries = (anchorPosition, anchorOrigin, targetPosition, targetOrigin, boundaryPosition) => {
    let relativeLeftPositionToAnchor = targetPosition.left;
    if (anchorOrigin.horizontal === Positions.right && targetOrigin.horizontal === Positions.left) {
        relativeLeftPositionToAnchor = anchorPosition.left + anchorPosition.width;
    }

    let relativeTopPositionToAnchor = targetPosition.top;
    if (anchorOrigin.vertical === Positions.top && targetOrigin.vertical === Positions.top) {
        relativeTopPositionToAnchor = anchorPosition.top;
    }

    let union = getUnion(boundaryPosition, {
        ...targetPosition,
        left: relativeLeftPositionToAnchor,
        top: relativeTopPositionToAnchor,
    });

    const belowBoundaryDiff = (boundaryPosition.top + boundaryPosition.height) - (union.top + union.height);
    if (belowBoundaryDiff < 0) {
        relativeTopPositionToAnchor += belowBoundaryDiff;
    }

    return {
        ...targetPosition,
        center: relativeLeftPositionToAnchor + targetPosition.width / 2,
        left: relativeLeftPositionToAnchor,
        top: relativeTopPositionToAnchor,
    };
};
