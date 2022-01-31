function list() {
	const LW = arguments[4] / 255
	const LR = Math.max(arguments[1] / 255, LW)
	const LG = Math.max(arguments[2] / 255, LW)
	const LB = Math.max(arguments[3] / 255, LW)
	
	const RW = arguments[8] / 255
	const RR = Math.max(arguments[5] / 255, RW)
	const RG = Math.max(arguments[6] / 255, RW)
	const RB = Math.max(arguments[7] / 255, RW)
	
	outlet(0, "start", 0.0, LR, LG, LB) // Left LED
	outlet(0, "end", 0.0, RR, RG, RB) // Right LED
	outlet(0, "bang")
}