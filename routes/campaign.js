const express = require("express");
const Campaign = require("../models/campaign-model");
const TYPES = require("../models/campaign-types-model");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");
const {
  checkOwnership,
  authorizeCampaign
} = require("../middleware/campaign-authorization");

router.get("/new", (req, res) => {
  res.render("campaign-views/new-campaign-view", { 
      types: TYPES 
    });
});

router.post("/", ensureLoggedIn("/login"), (req, res, next) => {
  const newCampaign = new Campaign({
    title: req.body.title,
    goal: req.body.goal,
    description: req.body.description,
    category: req.body.category,
    deadline: req.body.deadline,
    // We're assuming a user is logged in here
    // If they aren't, this will throw an error
    _creator: req.user._id
  });

    newCampaign.save(err => {
      console.log("newCampaign._id: ", newCampaign._id);
        if (err) {
            res.render("campaign-views/new-campaign-view", {
              campaign: newCampaign,
              types: TYPES
            });
        } else {
            console.log("newCampaign._id", newCampaign._id);
            res.redirect(`/campaigns/${newCampaign._id}`);
        }
    });
});

router.get("/:id", checkOwnership, (req, res, next) => {
  Campaign.findById(req.params.id, (err, campaign) => {
    if (err) {
      return next(err);
    }

    campaign.populate("_creator", (err, campaign) => {
      if (err) {
        return next(err);
      }
      return res.render("campaign-views/show-view", { 
          campaign 
        });
    });
  });
});

router.get('/:id/edit', ensureLoggedIn('/login'), authorizeCampaign, (req, res, next) => {
  Campaign.findById(req.params.id, (err, campaign) => {
    if (err){ 
      return next(err) 
    }
    if (!campaign) { 
      return next(new Error("404")) 
    }
    return res.render('campaign-views/edit-view', { campaign, types: TYPES })
  });
});

router.post('/:id', ensureLoggedIn('/login'), authorizeCampaign, (req, res, next) => {
  const updates = {
    title: req.body.title,
    goal: req.body.goal,
    description: req.body.description,
    category: req.body.category,
    deadline: req.body.deadline
  };

  Campaign.findByIdAndUpdate(req.params.id, updates, (err, campaign) => {
    if (err) {
      return res.render('campaigns/edit', {
        campaign,
        errors: campaign.errors
      });
    }
    if (!campaign) {
      return next(new Error('404'));
    }
    return res.redirect(`/campaigns/${campaign._id}`);
  });
});


module.exports = router;
