import stations from "../models/rtc_station";
import staff from "../models/rtc_staff";
import groups from "../models/rtc_groups";
import farmers from "../models/rtc_farmers";
import households from "../models/rtc_households";
import training from "../models/rtc_training";
import inspectionQn from "../models/rtc_inspection_questions";

class mobileSyncController {
  static async retrieveStations(req, res) {
    try {
      let allStations = [];

      const { userId } = req.params;

      const staffData = await staff.findOne({
        where: { _kf_User: userId },
      });

      if (!staffData || staffData.length === 0) {
        return res
          .status(404)
          .json({ status: "fail", message: "staff user not found" });
      }

      const userStation = await stations.findOne({
        where: { __kp_Station: staffData._kf_Station },
      });

      if (!userStation || userStation.length === 0) {
        return res
          .status(404)
          .json({ status: "fail", message: "No station found" });
      }

      allStations.push(userStation);
      return res
        .status(200)
        .json({ status: "success", table: "rtc_stations", data: allStations });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }

  static async retrieveGroups(req, res) {
    try {
      let allGroups = [];

      const { stationId } = req.params;

      allGroups = await groups.findAll({
        where: { _kf_Station: stationId },
      });

      if (!allGroups || allGroups.length === 0) {
        return res
          .status(404)
          .json({ status: "fail", message: "No groups found" });
      }

      return res
        .status(200)
        .json({ status: "success", table: "rtc_groups", data: allGroups });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }

  static async retrieveFarmers(req, res) {
    try {
      let allFarmers = [];

      const { stationId } = req.params;

      allFarmers = await farmers.findAll({
        where: { _kf_Station: stationId },
      });

      if (!allFarmers || allFarmers.length === 0) {
        return res
          .status(404)
          .json({ status: "fail", message: "No farmers found" });
      }

      return res
        .status(200)
        .json({ status: "success", table: "rtc_farmers", data: allFarmers });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }

  static async retrieveHouseholds(req, res) {
    try {
      let allHouseholds = [];

      const { stationId } = req.params;

      allHouseholds = await households.findAll({
        where: { _kf_Station: stationId },
      });

      if (!allHouseholds || allHouseholds.length === 0) {
        return res
          .status(404)
          .json({ status: "fail", message: "No households found" });
      }

      return res.status(200).json({
        status: "success",
        table: "rtc_households",
        data: allHouseholds,
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }

  static async retrieveTrainingModules(req, res) {
    try {
      let allModules = [];

      allModules = await training.findAll();

      if (!allModules || allModules.length === 0) {
        return res
          .status(404)
          .json({ status: "fail", message: "No training modules found" });
      }

      return res.status(200).json({
        status: "success",
        table: "rtc_trainingModules",
        data: allModules,
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }

  static async retrieveCrops(req, res) {}

  static async retrieveInspectionQuestions(req, res) {
    try {
      let allQns = [];

      allQns = await training.findAll();

      if (!allQns || allQns.length === 0) {
        return res
          .status(404)
          .json({ status: "fail", message: "No inspection questions found" });
      }

      return res.status(200).json({
        status: "success",
        table: "inspection_questions",
        data: allQns,
      });
    } catch (error) {
      return res.status(500).json({ status: "fail", error: error.message });
    }
  }
}

export default mobileSyncController;
