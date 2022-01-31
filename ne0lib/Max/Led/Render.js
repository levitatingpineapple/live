outlets = 12
var playbackClip = 0 // Clip index for playback.
var clip = 0 // Clip index for editing and displaying
var clips = [] // [clip][channel][point]
for (var i = 0; i < 128; i++) { clips.push([ [], [], [], [], [], [], [], [] ]) }
var flash = [240, 0, 0, 0, 0, 0, 0, 0, 0, 247]
var fade = [240, 0, 0, 0, 0, 0, 0, 0, 0, 247]
var output = [240, 0, 0, 0, 0, 0, 0, 0, 0, 247]

// INTERFACE

function clear(channel) { clips[clip][channel] = [] }

function setPoint(channel, x, y) { 
	clips[clip][channel].push({ x: x, y: y })
	save()
}

function msg_int(clip) {
	post(clip)
	for (var channel = 0; channel < 8; channel++) {
		if (clips[clip][channel].length > 0) { // Clip not empty
			playbackClip = clip // Set the clip to playback
			outlet(9, "bang") // Drive the line here
			return
		}
	}
}

function msg_float(x) {
	for (var channel = 0; channel < 8; channel++) {
		var index = channel + 1
		flash[index] = y(clips[playbackClip][channel], x)
		output[index] = Math.max(
			flash[index], 
			fade[index]
		)
	}
	outlet(0, output)
}

function list() {
	for (var channel = 0; channel < 8; channel++) {
		var index = channel + 1
		fade[index] = arguments[index]
		output[index] = Math.max(
			flash[index], 
			fade[index]
		)
	}
	outlet(0, output)
}

function display(clip) {
	this.clip = clip
	for (var channel = 0; channel < 8; channel++) {
		outlet(channel + 1, "clear")
		const points = clips[clip][channel]
		for (var point = 0; point < points.length; point++) {
			outlet(channel + 1, [points[point].x, points[point].y])
		}
	}
}

function save() {
	outlet(10, clip) // Set pattr gate
	outlet(11, JSON.stringify(clips[clip])) // Save to pattr
}

function load(index, channels) {
	clips[index] = JSON.parse(channels)
}

// Y value for composed function.
function y(points, x) {
	if (points.length < 2) return 0
	for (point = 1; point < points.length; point++) {
		if (x >= points[point - 1].x && x < points[point].x) {
			const l = points[point - 1] // Left Point
			const r = points[point] // Right Point
			const m = (r.y - l.y) / ( r.x - l.x )
			const b = l.y - (m * l.x)
			const y = m * x + b // y = mx + b
			return Math.round(y * 127)
		}
	}
	return 0
}