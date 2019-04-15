export function Vector(magnitude, angle) {
    var angleRadians = (angle * Math.PI) / 180;
  
    this.magnitudeX = magnitude * Math.cos(angleRadians);
    this.magnitudeY = magnitude * Math.sin(angleRadians);
}