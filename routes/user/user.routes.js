// const FunCollection = require("../../models/FunColletion.model");
// const User = require("../../models/User.model");
// const Fun = require("../../models/Bill.model");
// const Invitation = require("../../models/Invitation.model");
// const Message = require("../../models/Message.model");

// const router = require("express").Router();

// //* GET "/api/user/findFriends" => devuelve un array con el nombre, apellido e id de todos los usuarios.
// router.get("/findFriends", async (req, res, next) => {
//   try {
//     const response = await User.find().select({
//       username: 1,
//       lastName: 1,
//       friends: 1,
//     });
//     console.log(response);
//     res.json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// //* PATCH "/api/user/addFriend" => incluye como amigo en cada array del usuario y otro usuario.
// router.patch("/addFriend", async (req, res, next) => {
//   const { _id } = req.payload;
//   console.log(req.body);
//   const friendId = req.body.id;

//   try {
//     await User.findByIdAndUpdate(_id, { $addToSet: { friends: friendId } });
//     await User.findByIdAndUpdate(friendId, { $addToSet: { friends: _id } });

//     res.json("invitation accepted");
//   } catch (error) {
//     next(error);
//   }
// });

// //* GET "/api/user/myProfile" => devuelve los datos de mi perfil

// router.get("/myProfile", async (req, res, next) => {
//   const { _id } = req.payload;
//   try {
//     const response = await User.findById(_id).populate("friends");
//     res.json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// //* GET "/api/user/myFriends" => devuelve un array de mis amigos y sus ids
// router.get("/myFriends", async (req, res, next) => {
//   const { _id } = req.payload;
//   try {
//     const response = await User.findById(_id).select("friends").populate({
//       path: "friends",
//       select: "_id username",
//     });
//     res.json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// //* POST "/api/user/newFun" => recibe unos datos de un formulario y crea todo lo necesario para crear un fun
// router.post("/newFun", async (req, res, next) => {
//   // console.log(req.body);
//   const { newFun, arrUsers } = req.body;
//   const { title, description, date, time, isPublic, mainImg } = newFun;
//   const { _id } = req.payload;

//   try {
//     const funCollection = { title };
//     const respFunColl = await FunCollection.create(funCollection);

//     const fun = {
//       description,
//       date,
//       time,
//       isPublic,
//       mainImg,
//       collection: respFunColl._id,
//       creator: _id,
//     };

//     const respFun = await Fun.create(fun);
//     await FunCollection.findByIdAndUpdate(respFunColl._id, {
//       $push: { funs: respFun._id },
//     });

//     const invitation = { inviter: _id, guests: arrUsers, fun: respFun._id };
//     invitation.length > 0 && (await Invitation.create(invitation));

//     // const messagesArr = arrUsers.map((eachId) => {
//     //   return {
//     //     category: "invitation",
//     //     sender: _id,
//     //     receiver: eachId,
//     //     message: description,
//     //     fun: respFun._id,
//     //     isFresh: true,
//     //   };
//     //   console.log(messagesArr)
//     // });

//     // await Message.insertMany(messagesArr)


//     await User.findByIdAndUpdate(_id, {
//       $addToSet: { funs: respFun._id },
//     });

//     res.json("hecho");
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

// //* POST "/api/user/forkFun" => recibe unos datos de un formulario y CLONA UN FUN  y todo lo necesario
// router.post("/forkFun", async (req, res, next) => {
//   const { forkFun, guestsArr } = req.body;
//   const { description, date, time, isPublic, mainImg, collection } = forkFun;
//   const { _id } = req.payload;

//   try {
//     const fun = {
//       description,
//       date,
//       time,
//       isPublic,
//       mainImg,
//       collection,
//       creator: _id,
//     };

//     const respFun = await Fun.create(fun);
//     await FunCollection.findByIdAndUpdate(collection, {
//       $addToSet: { funs: respFun._id },
//     });
//     console.log("collection", collection);

//     await User.findByIdAndUpdate(_id, {
//       $addToSet: { funs: respFun._id },
//     });
//     const invitations = guestsArr.map(async (eachId) => {
//       return { inviter: _id, invitee: eachId, fun: respFun._id };
//     });
//     try {
//       await Invitation.insertMany(invitations); //insertMany()  //* updateMany([id], []) //addToSet
//     } catch (error) {
//       next(error);
//     }
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

// //* GET "/api/user/myFuns" => devulve un json con los datos de los funs del usuario.

// router.get("/myFuns", async (req, res, next) => {
//   const { _id } = req.payload;

//   try {
//     const response = await User.findById(_id)
//       .select({ funs: 1 })
//       .populate({
//         path: "funs",
//         populate: {
//           path: "collection",
//           model: "FunCollection",
//         },
//       });

//     res.json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// //* GET "/api/user/publicFuns" => devulve un json con los datos de los funs publicos.

// router.get("/publicFuns", async (req, res, next) => {
//   try {
//     const response = await FunCollection.find().populate({
//       path: 'funs',
//       match: { isPublic: true }});



    



//     res.json(response);
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
