#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra')
const sharp = require('sharp');
const icongen = require( 'icon-gen' );

const args = process.argv.slice(2);

const allRWEPermissions = parseInt("0777", 8);
const pathToPng = args[0];
const sizes = [
	1024,
	512,
	256,
	128,
	96,
	64,
	48,
	32,
	24,
	16
]
const dirsToCreate = [
	'png',
	'win',
	'mac'
]

fs.access(pathToPng, (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error(`png file doesn't exist`);
      return;
    }

    throw err;
    process.exit(-1);
  }
});

const resizePngPromises = sizes.map(size => {

	return new Promise(
		(resolve, reject) => {
			sharp(pathToPng)
				.resize({
					width: size,
					height: size,
					fit: 'contain',
					background: {
						r: 0,
						g: 0,
						b: 0,
						alpha: 0
					},
				})
				.toFormat('png')
				.toBuffer(function(err, outputBuffer) {
					if (err) {
						throw err
						reject(err);
					}

					return resolve({
						outputBuffer,
						size
					})

				});
		}
	)

})

const savePngs = (pngs) => {

	const savePngPromises = pngs.map(
		png => new Promise (
			(resolve, reject) => {
				fs.writeFile(`icons/png/${png.size}.png`, png.outputBuffer, function (err) {
					if (err) {
						throw err
						return reject(err);
					}

					return resolve();
				})
			}
		)
	)

	return Promise.all(savePngPromises);

}

const createDirectories = () => {

	const createDirsPromises = dirsToCreate.map(
		dir => new Promise (
			(resolve, reject) => {
				fs.mkdir(`icons/${dir}`, allRWEPermissions, (err) => {

					if(err) {
						throw err;
					}

					console.log('created ' + dir)

					resolve();

				});
			}
		)
	)

	return Promise.all(createDirsPromises);

}

const removeiconsDirs = () => {

	return new Promise (
		(resolve, reject) => {

			fse.remove('icons', err => {

				if(err) {
					reject(err);
					throw err;
				}

				return resolve();

			})

		}
	)

}

const readDir = (dirSrc) => {
	return new Promise (
		(res, rej) => {
			fs.readdir(dirSrc, (err, files) => {
				if(err)
					rej(err);

				res(files.map((file) => {
					return {
						filename: file,
						path: path.join(dirSrc, file)
					}
				}));
			})
		}
	)
}

const renamePngs = () => {
	const pngOutputDir = './icons/png';

	readDir(pngOutputDir)
		.then(files => {

			const filesPromises = files.map(
				file => new Promise ((resolve, reject) => {

					const size = file.filename.split('.')[0];

					fs.rename(file.path, path.join(pngOutputDir, `${size}x${size}.png`), (err) => {

						if(err) {
							throw err;
							return reject(err);
						}

						console.log(`renamed ${size}.png`)

						return resolve();

					})

				})
			)

			Promise.all(
				filesPromises
			).then(
				() => console.log('renamed all')
			)

		})
}

const generateIcons = (outputDir, mode) => {
	return icongen('./icons/png', outputDir, {type: 'png',names: {mode:'icon'}, modes:[mode]})
}

// start execution

removeiconsDirs()
	.then(
		() => fs.mkdir('icons', allRWEPermissions, () => {

			createDirectories()
				.then(
					values => {
						Promise.all(resizePngPromises)
							.then(
								values => {

									savePngs(values)
										.then(values =>{
											console.log('icons PNGS')
											generateIcons('./icons/win', 'ico')
											.then((results) => {
												console.log('icons ICO')
												generateIcons('./icons/mac', 'icns')
												.then((results) => {
												  console.log('icons ICNS')
												  renamePngs()
												})
												.catch((err) => {
												  console.error(err)
												});
											})
											.catch((err) => {
											  console.error(err)
											});
										})


								}
							)
					}
				)

		})
	)
