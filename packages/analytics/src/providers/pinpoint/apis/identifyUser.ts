// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
	UpdateEndpointException,
	updateEndpoint,
} from '@aws-amplify/core/internals/providers/pinpoint';

import { AnalyticsValidationErrorCode } from '../../../errors';
import { IdentifyUserInput } from '../types';
import { resolveConfig, resolveCredentials } from '../utils';

/**
 * Sends information about a user to Pinpoint. Sending user information allows you to associate a user to their user
 * profile and activities or actions in your application. Activity can be tracked across devices & platforms by using
 * the same `userId`.
 *
 * @param {IdentifyUserInput} params The input object used to construct requests sent to Pinpoint's UpdateEndpoint
 *  API.
 *
 * @throws service: {@link UpdateEndpointException} - Thrown when the underlying Pinpoint service returns an error.
 * @throws validation: {@link AnalyticsValidationErrorCode} - Thrown when the provided parameters or library
 *  configuration is incorrect.
 *
 * @returns A promise that will resolve when the operation is complete.
 *
 * @example
 * ```ts
 * // Identify a user with Pinpoint
 * await identifyUser({
 *     userId,
 *     userProfile: {
 *         email: 'userEmail@example.com'
 *         customProperties: {
 *             phoneNumber: ['555-555-5555'],
 *         },
 *     }
 * });
 * ```
 *
 * @example
 * ```ts
 * // Identify a user with Pinpoint with some additional demographics
 * await identifyUser({
 *     userId,
 *     userProfile: {
 *         email: 'userEmail@example.com'
 *         customProperties: {
 *             phoneNumber: ['555-555-5555'],
 *         },
 *         demographic: {
 *             platform: 'ios',
 *             timezone: 'America/Los_Angeles'
 *         }
 *     }
 * });
 */
export const identifyUser = async ({
	userId,
	userProfile,
	options,
}: IdentifyUserInput): Promise<void> => {
	const { credentials, identityId } = await resolveCredentials();
	const { appId, region } = resolveConfig();
	const { userAttributes } = options ?? {};

	const channelTypes = [
		{
			channelType: 'EMAIL',
			category: 'Analytics',
		},
	];

	const endpointPromises = channelTypes.map(({ channelType, category }) => {
		const payload = {
			userId,
			address: userId,
			channelType,
			appId,
			category,
			credentials,
			identityId,
			region,
			userAttributes,
			userProfile,
			optOut: 'NONE',
		};

		return updateEndpoint(payload as any);
	});
	await Promise.all(endpointPromises);
};
