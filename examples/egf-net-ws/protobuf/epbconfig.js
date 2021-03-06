/**
 * @type {EgfProtobufConfig}
 */
module.exports = {
	options: {
		"no-create": false,
		"no-verify": false,
		"no-convert": true,
		"no-delimited": true
	},
	concatPbjsLib: false,
	pbjsLibDir: "egf-ccc-net-ws/assets/libs",
	outputFileType: 1,
	dtsOutDir: "egf-ccc-net-ws/libs",
	sourceRoot: "protofiles",
	outFileName: "proto_bundle",
	outputDir: "egf-ccc-net-ws/assets/protojs",
	serverOutputConfig: {
		pbjsLibDir: "egf-net-ws-server/libs",
		pbjsOutDir: "egf-net-ws-server/protojs",
		dtsOutDir: "egf-net-ws-server/libs"

	}

} 