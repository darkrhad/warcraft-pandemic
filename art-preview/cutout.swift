// Cuts the subject out of a picture with macOS Vision (subject lift), saves a transparent PNG.
//   swift cutout.swift in.png out.png
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
let input = CIImage(contentsOf: URL(fileURLWithPath: args[1]))!
let request = VNGenerateForegroundInstanceMaskRequest()
try VNImageRequestHandler(ciImage: input).perform([request])
guard let result = request.results?.first else { fatalError("No subject found") }
let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: VNImageRequestHandler(ciImage: input), croppedToInstancesExtent: true)
let out = CIImage(cvPixelBuffer: buffer)
let ctx = CIContext()
try ctx.writePNGRepresentation(of: out, to: URL(fileURLWithPath: args[2]), format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("saved \(args[2]) \(Int(out.extent.width))x\(Int(out.extent.height))")
