#! /usr/bin/env node

const fs = require('fs');
const fse = require('fs-extra')
const sharp = require('sharp');

const args = process.argv.slice(2);

const allRWEPermissions = parseInt("0777", 8);
const pathToPng = args[0];
const sizes = [
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
				.resize(size, size)
				.background({r: 0, g: 0, b: 0, alpha: 0})
				.embed()
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
				fs.writeFile(`generated/png/${png.size}x${png.size}.png`, png.outputBuffer, function (err) {
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
				fs.mkdir(`generated/${dir}`, allRWEPermissions, (err) => {

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

const removeGeneratedDirs = () => {
	
	return new Promise (
		(resolve, reject) => {

			fse.remove('generated', err => {

				if(err) {
					reject(err);
					throw err;
				}

				return resolve();

			})

		}
	)

}

// start execution

removeGeneratedDirs()
	.then(
		() => fs.mkdir('generated', allRWEPermissions, () => {

			createDirectories()
				.then(
					values => {
						Promise.all(resizePngPromises)
							.then(
								values => {

									savePngs(values)
										.then(values => console.log('completed'))

								}
							)
					}
				)

		})
	)