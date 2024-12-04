// Third-Party Imports
import request from "request-promise-native";

// Models
import Member from "../../../private/models/Member.js";

// Modules
import { getPatreonToken } from "../../apis/patreon.js";

/**
 * Queries a single member from the Patreon API.
 *
 * @param {string} memberId - The ID of the member to query.
 * @returns {Promise<void>} - The retrieved member data.
 */
export const queryOneMember = async (memberId) => {
  try {
    // Step 1: Get Patreon token
    const patreon_access_token = await new Promise((resolve, reject) => {
      getPatreonToken((err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    });

    // Step 2: Query member data from Patreon API
    const body = await request({
      url: `https://www.patreon.com/api/oauth2/v2/members/${memberId}?include=address,pledge_history,currently_entitled_tiers,user&fields%5Bmember%5D=email,full_name,currently_entitled_amount_cents,pledge_cadence,last_charge_date&fields%5Btier%5D=amount_cents,created_at,description,discord_role_ids,edited_at,patron_count,published,published_at,requires_shipping,title,url&fields%5Baddress%5D=addressee,city,line_1,line_2,phone_number,postal_code,state,country&page%5Bcount%5D=1000`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        Authorization: "Bearer " + patreon_access_token,
      },
      json: true,
    });

    const member = body.data;

    if (member) {
      const email = member.attributes.email,
        last_charge_date = new Date(member.attributes.last_charge_date),
        now = new Date(),
        pledge_cadence = member.attributes.pledge_cadence;

      const currentlyEntitledTiers =
          member.relationships?.currently_entitled_tiers?.data,
        pledgeHistory = member.relationships?.pledge_history?.data;

      const pledges = {};

      if (pledgeHistory) {
        pledgeHistory.forEach((history) => {
          body.included.filter((obj) => {
            if (obj.id === history.id) {
              // check to see if the obj payment was successful
              if (
                obj.attributes.payment_status === "Paid" ||
                obj.attributes.payment_status === null
              ) {
                // get the year and month from the obj
                const historyDate = new Date(obj.attributes.date),
                  historyYear = historyDate.getFullYear(),
                  historyMonth = historyDate.getMonth();

                // get the tier id
                const tierId = obj.attributes.tier_id;

                // find the tier in the included array
                body.included.filter((tier) => {
                  if (tier.id === tierId) {
                    if (!pledges[historyYear]) {
                      pledges[historyYear] = {};
                    }

                    // only add if there is either:
                    // a) no pledge for this month
                    // b) the pledge for this month is less than the pledge on record for this month
                    if (
                      !pledges[historyYear][historyMonth] ||
                      pledges[historyYear][historyMonth] <
                        tier.attributes.amount_cents
                    ) {
                      pledges[historyYear][historyMonth] =
                        tier.attributes.amount_cents;
                    }
                  }
                });
              }
            }
          });
        });
      }
    } else {
      console.info(`No member found with id: ${memberId}`);
    }
  } catch (err) {
    console.error("Error querying member");
    // console.error(err);
  }
};

/**
 * Archives Patreon members for a given campaign.
 *
 * @param {string} campaignId - The ID of the Patreon campaign.
 * @param {boolean} [archiveAll=false] - Whether to archive all members or not.
 * @returns {Promise<void>} - The result of the archiving operation.
 */
export const archiveMembers = async (campaignId, archiveAll = false) => {
  console.info("Beginning archive of Patreon patrons (this takes a while)");

  let count = 0;

  try {
    // Step 1: Get Patreon token
    const patreon_access_token = await getPatreonToken();

    // Step 2: Get Patreon members
    const getPatreonMembers = async (patreonUrl) => {
      count += 1;
      console.info(`Pulling patrons from Patreon: page ${count}`);

      const body = await request({
        url: patreonUrl,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
          Authorization: "Bearer " + patreon_access_token,
        },
        json: true,
      });

      body.data.forEach((member) => {
        const email = member.attributes.email,
          patreonId = member.id,
          last_charge_date = new Date(member.attributes.last_charge_date),
          now = new Date(),
          pledge_cadence = member.attributes.pledge_cadence;

        const currentlyEntitledTiers =
            member.relationships?.currently_entitled_tiers?.data,
          pledgeHistory = member.relationships?.pledge_history?.data;

        const pledges = {};

        if (pledgeHistory) {
          pledgeHistory.forEach((history) => {
            body.included.filter((obj) => {
              if (obj.id === history.id) {
                // check to see if the obj payment was successful
                if (
                  obj.attributes.payment_status === "Paid" ||
                  obj.attributes.payment_status === null
                ) {
                  // get the year and month from the obj
                  const historyDate = new Date(obj.attributes.date),
                    historyYear = historyDate.getFullYear(),
                    historyMonth = historyDate.getMonth();

                  // get the tier id
                  const tierId = obj.attributes.tier_id;

                  // Find the tier in the included array
                  const tier = body.included.find((tier) => tier.id === tierId);

                  if (tier) {
                    const tierAmountCents = tier.attributes.amount_cents;

                    if (!pledges[historyYear]) {
                      pledges[historyYear] = {};
                    }

                    // Only add if there is either:
                    // a) no pledge for this month
                    // b) the pledge for this month is less than the pledge on record for this month
                    if (
                      !pledges[historyYear][historyMonth] ||
                      pledges[historyYear][historyMonth] < tierAmountCents
                    ) {
                      pledges[historyYear][historyMonth] = tierAmountCents;
                    }
                  }
                }
              }
            });
          });
        }

        let currentPledge = 0;

        if (currentlyEntitledTiers) {
          currentlyEntitledTiers.forEach((tier) => {
            const tierObj = body.included.find((obj) => obj.id === tier.id);
            if (tierObj && tierObj.attributes.amount_cents > currentPledge) {
              currentPledge = tierObj.attributes.amount_cents;
            }
          });
        }

        // if the pledge_cadence is 12, we're getting an annual pledge,
        // so we can fill in the gaps in the pledges based on
        // the last_charge_date and the current date
        if (pledge_cadence === 12) {
          // get the year and month from the last charge date
          const lastChargeYear = last_charge_date.getFullYear(),
            lastChargeMonth = last_charge_date.getMonth();

          // get the year and month from the current date
          const currentYear = now.getFullYear(),
            currentMonth = now.getMonth();

          // loop through the years between the last charge date and the current date
          for (let year = lastChargeYear; year <= currentYear; year++) {
            // if we're on the last charge year, we need to start at the last charge month
            let startMonth = year === lastChargeYear ? lastChargeMonth : 0;
            // if we're on the current year, we need to end at the current month
            let endMonth = year === currentYear ? currentMonth : 11;

            // loop through the months
            for (let month = startMonth; month <= endMonth; month++) {
              // if the year doesn't exist in the pledges object, add it
              if (!pledges[year]) {
                pledges[year] = {};
              }

              // if the month doesn't exist in the pledges object, add it
              if (!pledges[year][month]) {
                pledges[year][month] = currentPledge;
              }
            }
          }
        }

        // check to see if this member's pledge has been updated in the past hour
        // or if we're archiving all members
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        if (
          last_charge_date > oneMonthAgo ||
          pledge_cadence === 12 || // getting those annual pledges
          (member.relationships?.address?.data !== undefined &&
            member.relationships.address.data !== null) ||
          archiveAll
        ) {
          // console.info("Pledge charge detected, updating member");
          // this is so we can blank out addresses if anyone removes their address
          // from patreon ie: they don't want physical posts
          let address = {
              addressee: "",
              city: "",
              country: "",
              line_1: "",
              line_2: "",
              phone_number: "",
              postal_code: "",
              state: "",
            },
            phone;

          if (
            member.relationships?.address?.data !== undefined &&
            member.relationships.address.data !== null
          ) {
            const addressId = member.relationships.address.data.id;

            body.included.filter((obj) => {
              if (obj.id === addressId) {
                address = obj.attributes;
                phone = obj.attributes.phone_number;
              }
            });
          }

          const memberData = {
            email,
            phone,
            address,
            currentPledge,
            pledges,
            patreonId,
          };

          Member.findOneAndUpdate(
            {
              email,
            },
            {
              $set: memberData,
            },
            {
              upsert: true,
              new: true,
            }
          ).catch((err) => {
            console.error("Error updating member");
            // console.error(err);
          });
        }
      });

      // check to see if there is a next value
      if (body.links !== undefined && body.links.next !== undefined) {
        // set a timeout so we don't get rate limited
        setTimeout(() => {
          getPatreonMembers(body.links.next);
        }, 5000);
      } else {
        console.info(`Finished pulling and archiving all Members from Patreon`);
      }
    };

    await getPatreonMembers(
      `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members?include=address,pledge_history,currently_entitled_tiers,user&fields%5Bmember%5D=email,full_name,currently_entitled_amount_cents,pledge_cadence,last_charge_date&fields%5Btier%5D=amount_cents,created_at,description,discord_role_ids,edited_at,patron_count,published,published_at,requires_shipping,title,url&fields%5Baddress%5D=addressee,city,line_1,line_2,phone_number,postal_code,state,country&page%5Bcount%5D=1000`
    );
  } catch (err) {
    console.error("Error archiving members");
    // console.error(err);
  }
};
