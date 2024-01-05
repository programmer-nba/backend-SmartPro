const fs = require("fs");

const {google} = require("googleapis");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

async function uploadFileCreate(req, res, {i, reqFiles}) {
  const filePath = req[i].path;
  let fileMetaData = {
    name: req.originalname,
    parents: [process.env.GOOGLE_DRIVE_NBA_HOTEL],
  };
  let media = {
    body: fs.createReadStream(filePath),
  };
  try {
    const response = await drive.files.create({
      resource: fileMetaData,
      media: media,
    });

    generatePublicUrl(response.data.id);
    reqFiles.push(response.data.id);
    console.log(response.data.id);
    return response.data.id;
  } catch (error) {
    res.status(500).send({message: "Internal Server Error"});
  }
}

async function generatePublicUrl(res) {
  console.log("generatePublicUrl");
  try {
    const fileId = res;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Permanently delete a file, skipping the trash.
 *
 * @param {String} fileId ID of the file to delete.
 */
async function deleteFile(fileId) {

  const res = await drive.files.delete({
    // Deprecated. If an item is not in a shared drive and its last parent is deleted but the item itself is not, the item will be placed under its owner's root.
    enforceSingleParent: true,
    // The ID of the file.
    fileId: fileId,
    // Whether the requesting application supports both My Drives and shared drives.
    supportsAllDrives: false,
    // Deprecated use supportsAllDrives instead.
    supportsTeamDrives: false,
  }).catch((error)=>{return false});

  // console.log(res);
  return res.data;
}

module.exports = {uploadFileCreate, deleteFile};
