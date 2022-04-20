import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {constants} from "http2";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

      //  Regex for image_url
  const regExpImageURL = /\.(avif|gif|jpeg|jpg|png|svg|webp)$/;

  //  Regex for blank
  const regExpBlank = /^\s*$/;

  //  Handle No matching resource found for given API Request
  app.use(function (req, res, next) {
    if (req.path != '/filteredimage' && req.path != '/') {
      console.error(`No matching resource found for given API Request, request path: ` + req.path);
      res.status(constants.HTTP_STATUS_NOT_FOUND).send(`No matching resource found for given API Request!`);
    }
    next()
  })

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let {image_url} = req.query;

    //  1. validate the image_url query
    if (isBlank(image_url)) {
      console.error(`image_url must not be blank`);
      return res.status(constants.HTTP_STATUS_BAD_REQUEST)
          .send(`image_url must not be blank!`);
    }

    //  1. validate the image_url query
    if (!isValidImage(image_url)) {
      console.error("image_url is not an image, image_url: " + image_url);
      return res.status(constants.HTTP_STATUS_BAD_REQUEST)
          .send(`image_url is not an image, image_url: ` + image_url);

    }

    //  2. call filterImageFromURL(image_url) to filter the image
    filterImageFromURL(image_url).then(result_image_url => {
      //  3. send the resulting file in the response
      res.status(constants.HTTP_STATUS_OK)
          .sendFile(result_image_url, () => {
            //  4. deletes any files on the server on finish of the response
            deleteLocalFiles([result_image_url]);
            console.log(`Local image is deleted successfully.`);
          });
      console.log(`Image is sent successfully.`);
    }).catch((e) => {
      console.error(`Error when filter image from url, image_url: ` + image_url + `, ` + e);
      return res.status(constants.HTTP_STATUS_UNPROCESSABLE_ENTITY)
          .send(`Error when filter image from url, image_url: ` + image_url);
    });
  })

  function isBlank(image_url: string) {
    return (!image_url || regExpBlank.test(image_url));
  }

  function isValidImage(image_url: string) {
    return regExpImageURL.test(image_url);
  }

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
